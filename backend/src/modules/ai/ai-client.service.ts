// src/modules/ai/ai-client.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiClientService {
    private readonly logger = new Logger(AiClientService.name);
    private readonly genAI: GoogleGenerativeAI;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            this.logger.warn('GEMINI_API_KEY is not configured. AI features will be disabled.');
            return;
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.logger.log('Gemini AI client initialized successfully');
    }

    async generateText(prompt: string): Promise<string> {
        if (!this.genAI) {
            throw new Error('AI client is not initialized. Is GEMINI_API_KEY set?');
        }

        try {
            // Using gemini-1.5-flash for better free tier quota (15 req/min vs 2 req/min)
            const model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    temperature: 0.7,  // Balanced creativity
                    maxOutputTokens: 500,  // Limit response length
                }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error('Empty response from AI model');
            }

            this.logger.debug(`Generated text (${text.length} chars)`);
            return text;
        } catch (error) {
            this.logger.error('Error generating text with Gemini API', error.stack);

            // Provide more specific error messages
            if (error.message?.includes('API_KEY')) {
                throw new Error('Invalid or missing Gemini API key');
            }
            if (error.message?.includes('quota')) {
                throw new Error('Gemini API quota exceeded');
            }

            throw new Error('Failed to get response from AI model.');
        }
    }
}
