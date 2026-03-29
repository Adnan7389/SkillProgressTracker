// src/modules/ai/resource-discovery.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { AiClientService } from "./ai-client.service.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { z } from "zod";

// Zod schema for validating a single resource search query from the AI response
const ResourceQuerySchema = z.object({
  type: z.enum(["doc", "youtube"]),
  title: z.string().max(200),
  searchQuery: z.string().min(5).max(300),
  description: z.string().max(300).default(""),
});

// Zod schema for the full AI response (object with resources array)
const ResourceQueryResponseSchema = z.object({
  resources: z.array(ResourceQuerySchema).min(1).max(6),
});

// Type definition for validated resources with real URLs
interface ValidatedResource {
  type: "doc" | "youtube";
  title: string;
  url: string;
  description: string;
  priority: number;
}

// Type definition for AI-generated search queries (fallback)
interface SearchQueryItem {
  type: string;
  title: string;
  query: string;
  description: string;
}

@Injectable()
export class ResourceDiscoveryService {
  private readonly logger = new Logger(ResourceDiscoveryService.name);
  private readonly googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
  private readonly googleEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  // Delay between Google searches to avoid rate limiting
  private readonly SEARCH_DELAY_MS = 1500;

  constructor(
    private readonly aiClientService: AiClientService,
    private readonly chaptersService: ChaptersService,
  ) {}

  /**
   * Discover and attach resources for a single chapter.
   *
   * FLOW:
   * 1. AI generates search queries (not URLs)
   * 2. If Google API configured: execute searches → extract real URLs → save
   * 3. If Google API not configured or quota exceeded: save queries as fallback
   */
  async discoverForChapter(
    chapterId: string,
    userId: string,
    chapterTitle: string,
    pathName: string,
    skillLevel: string,
  ): Promise<void> {
    this.logger.log(`Discovering resources for chapter: "${chapterTitle}"`);

    try {
      // Step 1: Get search queries from AI
      const prompt = this.buildSearchQueryPrompt(
        chapterTitle,
        pathName,
        skillLevel,
      );
      const responseText = await this.aiClientService.generateText(prompt);
      const resourceQueries = this.parseAndValidateQueries(responseText);

      this.logger.log(
        `AI returned ${resourceQueries.length} search queries for chapter: "${chapterTitle}"`,
      );

      // Step 2: Check if Google API is configured
      if (!this.googleApiKey || !this.googleEngineId) {
        this.logger.warn(
          `Google Custom Search API not configured. Saving search queries as fallback for chapter: "${chapterTitle}"`,
        );
        await this.saveAsFallback(chapterId, userId, resourceQueries);
        return;
      }

      // Step 3: Execute Google searches and extract URLs
      const resources = await this.executeGoogleSearches(resourceQueries);

      // Step 4: If we got results, save them. Otherwise, fallback to queries.
      if (resources.length > 0) {
        const prioritized = resources
          .sort((a, b) => {
            if (a.type === "doc" && b.type === "youtube") return -1;
            if (a.type === "youtube" && b.type === "doc") return 1;
            return 0;
          })
          .map((resource, index) => ({
            ...resource,
            priority: index + 1,
          }));

        await this.chaptersService.updateResources(
          chapterId,
          userId,
          prioritized,
          "completed",
        );
        this.logger.log(
          `Successfully attached ${prioritized.length} resources to chapter: "${chapterTitle}"`,
        );
      } else {
        // All searches failed — save queries as fallback
        this.logger.warn(
          `All Google searches returned empty. Saving queries as fallback for chapter: "${chapterTitle}"`,
        );
        await this.saveAsFallback(chapterId, userId, resourceQueries);
      }
    } catch (error) {
      // Quota exceeded, API error, or any other failure
      this.logger.error(
        `Resource discovery failed for chapter "${chapterTitle}": ${error.message}`,
      );

      // Try to get queries from AI again and save as fallback
      try {
        const prompt = this.buildSearchQueryPrompt(
          chapterTitle,
          pathName,
          skillLevel,
        );
        const responseText = await this.aiClientService.generateText(prompt);
        const resourceQueries = this.parseAndValidateQueries(responseText);
        await this.saveAsFallback(chapterId, userId, resourceQueries);
        this.logger.log(
          `Saved search queries as fallback for chapter: "${chapterTitle}"`,
        );
      } catch (fallbackError) {
        this.logger.error(
          `Fallback also failed for chapter "${chapterTitle}": ${fallbackError.message}`,
        );
        await this.chaptersService.updateResources(
          chapterId,
          userId,
          [],
          "failed",
        );
      }
    }
  }

  /**
   * Discover resources for multiple chapters in parallel.
   * Uses Promise.allSettled so one failure doesn't block others.
   */
  async discoverForChapters(
    chapters: Array<{ id: string; title: string }>,
    userId: string,
    pathName: string,
    skillLevel: string,
  ): Promise<void> {
    this.logger.log(
      `Starting resource discovery for ${chapters.length} chapters`,
    );

    const promises = chapters.map((chapter) =>
      this.discoverForChapter(
        chapter.id,
        userId,
        chapter.title,
        pathName,
        skillLevel,
      ),
    );

    await Promise.allSettled(promises);
    this.logger.log("Resource discovery completed for all chapters");
  }

  /**
   * Builds the prompt that asks AI for search queries instead of direct URLs.
   */
  private buildSearchQueryPrompt(
    chapterTitle: string,
    pathName: string,
    skillLevel: string,
  ): string {
    return `You are a learning resource curator. Your job is to suggest SEARCH QUERIES that will find excellent learning resources for the following chapter.

Topic: "${chapterTitle}"
Learning Path: "${pathName}"
Skill Level: "${skillLevel}"

Respond ONLY with a JSON object. No markdown, no explanation, no code blocks.

The JSON object MUST follow this exact structure:
{
  "resources": [
    {
      "type": "doc" (or "youtube"),
      "title": "short descriptive title for the resource",
      "searchQuery": "a specific search query to find this resource",
      "description": "short description of what this resource teaches"
    }
  ]
}

Constraints:
- Return exactly 3 documentation resources and exactly 2 YouTube resources (5 total) in the "resources" array
- Documentation resources MUST come first, YouTube resources last
- "type" must be exactly "doc" or "youtube"
- "title" must be max 60 characters, clear and descriptive
- "searchQuery" must be a specific search query that will find a real resource (5-300 characters)
- "description" must be max 100 characters, NO newlines

SEARCH QUERY RULES:
- For documentation (type="doc"):
  - Use site-specific queries like "site:developer.mozilla.org CSS fundamentals tutorial"
  - Target official documentation and well-known educational sites (freeCodeCamp, GeeksforGeeks, etc.)

- For YouTube (type="youtube"):
  - Include the channel name in the query, e.g., "Fireship JavaScript tutorial explained"
  - Target reputable channels (Fireship, Traversy Media, freeCodeCamp, etc.)

Example response:
{"resources":[{"type":"doc","title":"MDN CSS Fundamentals","searchQuery":"site:developer.mozilla.org CSS fundamentals tutorial beginner","description":"Official MDN guide covering CSS basics"},{"type":"youtube","title":"JavaScript Crash Course","searchQuery":"Fireship JavaScript tutorial 2024 explained","description":"Fast-paced JavaScript introduction"}]}
`;
  }

  /**
   * Parses and validates the AI response containing search queries.
   */
  private parseAndValidateQueries(
    responseText: string,
  ): z.infer<typeof ResourceQueryResponseSchema>["resources"] {
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    try {
      const rawData = JSON.parse(jsonText);
      const parsed = ResourceQueryResponseSchema.parse(rawData);
      return parsed.resources;
    } catch (err) {
      this.logger.error("Invalid AI resource query response structure", err);
      throw new Error("AI returned an invalid resource query structure.");
    }
  }

  /**
   * Executes Google searches for each query and extracts real URLs.
   *
   * Uses Google Custom Search JSON API:
   * https://developers.google.com/custom-search/v1/overview
   *
   * FREE TIER: 100 queries/day
   */
  private async executeGoogleSearches(
    queries: z.infer<typeof ResourceQuerySchema>[],
  ): Promise<ValidatedResource[]> {
    const resources: ValidatedResource[] = [];

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];

      // Add delay between searches to avoid rate limiting
      if (i > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.SEARCH_DELAY_MS),
        );
      }

      try {
        this.logger.debug(`Google searching: "${query.searchQuery}"`);

        const searchResults = await this.performGoogleSearch(query.searchQuery);

        if (searchResults.length > 0) {
          const firstResult = searchResults[0];
          const url = firstResult.link;

          if (this.isValidUrl(url)) {
            resources.push({
              type: query.type,
              title: firstResult.title || query.title,
              url: url,
              description: query.description,
              priority: 1,
            });
            this.logger.debug(`Found valid URL: ${url}`);
          } else {
            this.logger.warn(`Invalid URL format from Google: ${url}`);
          }
        } else {
          this.logger.warn(`No Google results for: "${query.searchQuery}"`);
        }
      } catch (error) {
        // Check if this is a quota exceeded error
        if (
          error.message?.includes("quota") ||
          error.message?.includes("429")
        ) {
          this.logger.error("Google Custom Search API quota exceeded!");
          // Stop searching and return what we have
          break;
        }
        this.logger.error(
          `Google search failed for "${query.searchQuery}": ${error.message}`,
        );
        // Continue with next query
      }
    }

    this.logger.log(
      `Successfully found ${resources.length}/${queries.length} resources via Google`,
    );
    return resources;
  }

  /**
   * Performs a Google Custom Search using the JSON API.
   *
   * API endpoint: https://www.googleapis.com/customsearch/v1
   * Docs: https://developers.google.com/custom-search/v1/using_rest
   */
  private async performGoogleSearch(
    query: string,
  ): Promise<Array<{ link: string; title: string }>> {
    const url = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleEngineId}&q=${encodeURIComponent(query)}&num=5`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      const status = response.status;

      if (status === 429) {
        throw new Error("Google Custom Search API quota exceeded (429)");
      }

      if (status === 403) {
        // Parse error details for quota info
        const errorMsg = `Google API error (403): ${errorBody}`;
        if (
          errorBody.includes("Daily Limit Exceeded") ||
          errorBody.includes("quotaExceeded")
        ) {
          throw new Error("Google Custom Search API daily quota exceeded");
        }
        throw new Error(errorMsg);
      }

      throw new Error(`Google API error (${status}): ${errorBody}`);
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      return [];
    }

    return data.items.map((item: { link: string; title: string }) => ({
      link: item.link,
      title: item.title,
    }));
  }

  /**
   * Saves AI-generated search queries as a fallback when Google API fails
   * or is not configured.
   *
   * The frontend will display these as clickable "Search on DuckDuckGo" buttons.
   */
  private async saveAsFallback(
    chapterId: string,
    userId: string,
    queries: z.infer<typeof ResourceQuerySchema>[],
  ): Promise<void> {
    const searchQueries: SearchQueryItem[] = queries.map((q) => ({
      type: q.type,
      title: q.title,
      query: q.searchQuery,
      description: q.description,
    }));

    await this.chaptersService.saveSearchQueries(
      chapterId,
      userId,
      searchQueries,
    );
    this.logger.log(
      `Saved ${searchQueries.length} search queries as fallback for chapter`,
    );
  }

  /**
   * Validates that a string is a properly formatted URL.
   */
  private isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
}
