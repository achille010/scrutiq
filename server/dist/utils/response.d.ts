import { Response } from "express";
/**
 * TECHNICAL API RESPONSE UTILITY
 * Standardizes the administrative feedback protocol across the Aurora portal.
 */
export declare const sendSuccess: (res: Response, data: any, status?: number) => Response<any, Record<string, any>>;
export declare const sendFault: (res: Response, message: string, status?: number) => Response<any, Record<string, any>>;
