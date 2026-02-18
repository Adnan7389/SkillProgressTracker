import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Assessment, AssessmentDocument } from "./schemas/assessment.schema.js";
import { QuizAttempt, QuizAttemptDocument } from "./schemas/quiz-attempt.schema.js";
import { GenerateAssessmentDto } from "./dto/generate-assessment.dto.js";
import { SubmitAssessmentDto } from "./dto/submit-assessment.dto.js";
import { ChaptersService } from "../chapters/chapters.service.js";
import { AiClientService } from "../ai/ai-client.service.js";
import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answer: z.number().min(0).max(3),
  explanation: z.string(),
});

const AssessmentGenerationSchema = z.array(QuestionSchema).min(3).max(5);

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<AssessmentDocument>,
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: Model<QuizAttemptDocument>,
    private readonly chaptersService: ChaptersService,
    private readonly aiClientService: AiClientService,
  ) { }

  async generateAssessment(userId: string, dto: GenerateAssessmentDto) {
    // 1. Verify chapter exists and user has access
    const chapter = await this.chaptersService.findOne(dto.chapterId, userId);

    // 2. Check if an assessment already exists for this chapter
    let assessment = await this.assessmentModel.findOne({
      chapterId: chapter._id,
    });
    if (assessment) {
      return assessment; // Return cached assessment
    }

    // 3. Prepare AI Prompt
    const notesStr = chapter.notes?.map((n) => n.text).join("\n") || "";
    const contentContext = `Title: ${chapter.title}\nDescription: ${chapter.description}\nNotes: ${notesStr}`;

    const prompt = `
You are an expert technical educator. Generate a quiz for a chapter with these key points:
${contentContext}

Constraints:
- Generate ONLY Multiple Choice Questions (MCQs).
- Generate between 3 and 5 questions.
- Distractors for MCQs must be plausible but clearly wrong.
- Output MUST be a valid JSON array.

Response Schema:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0, // Integer index (0-3) of the correct option in the options array
    "explanation": "Brief explanation of why this is the correct answer"
  }
]
`;

    try {
      // 4. Call AI and parse response
      const responseText = await this.aiClientService.generateText(prompt);
      const parsedQuestions = this.parseAndValidateAssessment(responseText);

      // 5. Save and return new assessment
      assessment = new this.assessmentModel({
        chapterId: chapter._id,
        questions: parsedQuestions,
      });

      return await assessment.save();
    } catch {
      throw new BadRequestException(
        "Failed to generate assessment. Please try again.",
      );
    }
  }

  async submitAssessment(userId: string, dto: SubmitAssessmentDto) {
    // 1. Validate Assessment exists
    const assessment = await this.assessmentModel.findById(dto.assessmentId);
    if (!assessment) {
      throw new NotFoundException("Assessment not found");
    }

    if (assessment.chapterId.toString() !== dto.chapterId) {
      throw new BadRequestException(
        "Assessment does not belong to this chapter",
      );
    }

    if (dto.answers.length !== assessment.questions.length) {
      throw new BadRequestException("Must provide answers for all questions");
    }

    // 2. Score the attempt
    let correctCount = 0;
    assessment.questions.forEach((q, index) => {
      if (q.answer === dto.answers[index]) {
        correctCount++;
      }
    });

    const score = Math.round(
      (correctCount / assessment.questions.length) * 100,
    );

    // 3. Save Attempt
    const attempt = new this.quizAttemptModel({
      userId,
      assessmentId: assessment._id,
      chapterId: dto.chapterId,
      answers: dto.answers,
      score,
    });

    await attempt.save();

    // 4. Return result with feedback (correct answers and explanations)
    // In a real app, you might want to obscure correct answers if they fail,
    // but for MVP we return the full feedback.
    return {
      score,
      totalQuestions: assessment.questions.length,
      correctAnswers: correctCount,
      feedback: assessment.questions.map((q, i) => ({
        questionNumber: i + 1,
        isCorrect: q.answer === dto.answers[i],
        correctOption: q.answer,
        explanation: q.explanation,
      })),
    };
  }

  async getAttemptHistory(userId: string, chapterId: string) {
    return this.quizAttemptModel
      .find({ userId, chapterId })
      .sort({ createdAt: -1 })
      .exec();
  }

  private parseAndValidateAssessment(responseText: string) {
    let jsonText = responseText.trim();
    if (jsonText.startsWith("\`\`\`json")) jsonText = jsonText.slice(7);
    if (jsonText.startsWith("\`\`\`")) jsonText = jsonText.slice(3);
    if (jsonText.endsWith("\`\`\`")) jsonText = jsonText.slice(0, -3);
    jsonText = jsonText.trim();

    try {
      const rawData = JSON.parse(jsonText);
      return AssessmentGenerationSchema.parse(rawData);
    } catch {
      throw new Error("AI returned an invalid assessment structure.");
    }
  }
}
