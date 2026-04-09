import { Request, Response } from "express";
declare class AuthController {
    /**
     * HELP: Simple Register Logic
     * Saves a new user and sends a confirmation message.
     */
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * HELP: Simple Login Logic
     * Checks email and password to give access.
     */
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthController;
export default _default;
