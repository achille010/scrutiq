import { Request, Response } from "express";
declare class ScreeningController {
    /**
     * Technical Screening Execution Protocol:
     * Handles the request to execute candidate ranking against a job requirement.
     */
    execute(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getJobRankings(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: ScreeningController;
export default _default;
