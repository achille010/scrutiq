"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GeminiService {
    genAI;
    model;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || "";
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        // Reverting to the confirmed authorized model gemini-3.1-flash-lite-preview
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
        });
    }
    async executeWithRetry(prompt, attempt = 1) {
        const models = ["gemini-3.1-flash-lite-preview", "gemini-2.0-flash"];
        const modelToUse = attempt > 3 ? models[1] : models[0];
        const activeModel = this.genAI.getGenerativeModel({ model: modelToUse });
        try {
            const result = await activeModel.generateContent(prompt);
            return result;
        }
        catch (error) {
            const isOverload = error.message?.includes("503") ||
                error.message?.includes("demand") ||
                error.message?.includes("limit");
            if (isOverload && attempt < 6) {
                const delay = 5000 * attempt; // More aggressive backoff (5s, 10s, 15s...)
                console.warn(`[AI SERVICE OVERLOAD] Attempt ${attempt} failed for ${modelToUse}. Retrying in ${delay / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.executeWithRetry(prompt, attempt + 1);
            }
            throw error;
        }
    }
    /**
     * Technical Screening Protocol:
     * Analyzes candidate registry against job requirement matrix.
     */
    async screenCandidates(jobData, candidates) {
        const prompt = `
      TECHNICAL SCREENING PROTOCOL - RECRUITER ASSISTANT
      
      JOB REQUIREMENT MATRIX:
      Title: ${jobData.title}
      Description: ${jobData.description}
      Department: ${jobData.department}
      
      CANDIDATE REGISTRY:
      ${candidates
            .map((c, i) => `
        Candidate #${i + 1}:
        ID: ${c._id?.toString() || c.id}
        Name: ${c.name}
        Profile Data: ${JSON.stringify(c)}
      `)
            .join("\n")}
      
      INSTRUCTION:
      RETURN A STRUCTURED JSON ARRAY OF EVALUATIONS.
      
      FOR EACH CANDIDATE, EXTRACT AND RETURN:
      - candidateId: string (MUST MATCH THE ID PROVIDED ABOVE)
      - candidateName: string (Exact name from resume)
      - candidateEmail: string (Exact email from resume)
      - microSummary: string (A 20-word technical summary of experience)
      - matchScore: number (0-100)
      - strengths: string[]
      - gaps: string[]
      - finalRecommendation: "Priority Alignment" | "Technical Fit" | "Potential Fit" | "No Alignment"
      - reasoning: string (brief justification)
      
      REQUIRED OUTPUT FORMAT:
      A valid JSON array. Example: [{"candidateId": "...", "candidateName": "...", "candidateEmail": "...", "microSummary": "...", "matchScore": 85, ...}]
      JSON ONLY. Do not include any other conversational text.
    `;
        try {
            console.log(`[AI SERVICE] Initiating Gemini Screening Protocol for ${candidates.length} profiles...`);
            const result = await this.executeWithRetry(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`[AI SERVICE] Raw Response Extracted. Length: ${text.length}`);
            // SMART EXTRACTION: Find the starting '[' and ending ']' to isolate the JSON array
            const startIndex = text.indexOf("[");
            const endIndex = text.lastIndexOf("]");
            if (startIndex === -1 || endIndex === -1) {
                console.error("[AI FAULT] No valid JSON array found in response thought process.");
                console.log("Raw Response Trace:", text);
                throw new Error("The AI returned an invalid data format. Please try again.");
            }
            const jsonStr = text.substring(startIndex, endIndex + 1);
            const parsedResults = JSON.parse(jsonStr);
            console.log(`[AI SERVICE] Successfully parsed ${parsedResults.length} candidate evaluations.`);
            return parsedResults;
        }
        catch (error) {
            console.error("[AI SERVICE FAULT]:", error.message || error);
            if (error instanceof SyntaxError) {
                throw new Error("The AI response could not be parsed as valid data. Retrying may help.");
            }
            throw new Error(error.message || "Failed to execute AI screening protocol.");
        }
    }
}
exports.default = new GeminiService();
//# sourceMappingURL=gemini.service.js.map