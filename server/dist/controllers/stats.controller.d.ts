import { Request, Response } from "express";
declare class StatsController {
    /**
     * Technical System Stats Retrieval:
     * Returns high-level metrics across the entire recruitment registry.
     */
    getSystemStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: StatsController;
export default _default;
