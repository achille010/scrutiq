import { Request, Response, NextFunction } from "express";
/**
 * TECHNICAL ERROR PROTOCOL MIDDLEWARE
 * Provides structured administrative feedback for system faults.
 */
export declare const errorMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => void;
