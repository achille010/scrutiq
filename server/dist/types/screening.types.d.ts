export interface ScreeningResult {
    candidateId: string;
    candidateName: string;
    matchScore: number;
    strengths: string[];
    gaps: string[];
    finalRecommendation: "Priority Alignment" | "Technical Fit" | "Potential Fit" | "No Alignment";
    reasoning: string;
    timestamp?: string;
}
export interface ScreeningRequest {
    jobId: string;
    candidateIds: string[];
}
