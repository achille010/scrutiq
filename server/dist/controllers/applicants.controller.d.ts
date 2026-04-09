import { Request, Response } from "express";
declare class ApplicantsController {
    /**
     * Candidate Registry Retrieval:
     * Returns all profiles currently stored in the candidate registry.
     */
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Talent Profile Ingestion:
     * Handles administrative PDF/CSV uploads to the registry.
     */
    upload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Candidate Profile Initialization:
     * Adds a new technical profile to the candidate registry.
     */
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Profile Detail Retrieval:
     * Returns a specific candidate profile by ID.
     */
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ApplicantsController;
export default _default;
