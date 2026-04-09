import { Request, Response } from "express";
declare class JobsController {
    /**
     * Technical Requirement Registry Retrieval:
     * Returns all active job postings in the recruiter registry.
     */
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Job Requirement Initialization:
     * Adds a new technical requirement to the registry.
     */
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateJob(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Detail Matrix Retrieval:
     * Returns a specific job metric by ID.
     */
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: JobsController;
export default _default;
