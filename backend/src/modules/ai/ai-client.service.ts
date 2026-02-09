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
            // Using gemini-2.5-flash as the primary model (user can change this manually)
            const model = this.genAI.getGenerativeModel({
                model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json",
                }
            });

            this.logger.debug(`Calling Gemini API (2.5-flash) for prompt: ${prompt.substring(0, 50)}...`);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new Error('Empty response from AI model');
            }

            return text;
        } catch (error) {
            this.logger.error('Error generating text with Gemini API');

            // Detailed error logging to help user debug
            this.logger.error(`Error Message: ${error.message}`);

            if (error.message?.includes('API_KEY')) {
                throw new Error('Invalid or missing Gemini API key');
            }

            if (error.message?.includes('quota') || error.message?.includes('429')) {
                if (error.message?.includes('limit: 0')) {
                    throw new Error(
                        'Gemini Free Tier is restricted (Limit: 0) in your region (EU, UK, CH). ' +
                        'To fix: 1. Use a VPN set to USA, OR 2. Enable "Pay-as-you-go" in Google AI Studio.'
                    );
                }
                throw new Error('Gemini API quota exceeded. Please wait a few seconds and try again.');
            }

            if (error.message?.includes('404') || error.message?.includes('not found')) {
                throw new Error(`Model 'gemini-2.0-flash' not found. Please ensure your @google/generative-ai package is up to date.`);
            }

            throw new Error(`Failed to get response from AI model: ${error.message}`);
        }
    }
}
