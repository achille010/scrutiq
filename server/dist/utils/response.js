"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFault = exports.sendSuccess = void 0;
/**
 * TECHNICAL API RESPONSE UTILITY
 * Standardizes the administrative feedback protocol across the Aurora portal.
 */
const sendSuccess = (res, data, status = 200) => {
    return res.status(status).json({
        status: "success",
        data: data,
        timestamp: new Date().toISOString()
    });
};
exports.sendSuccess = sendSuccess;
const sendFault = (res, message, status = 500) => {
    return res.status(status).json({
        status: "fault",
        message: message,
        protocol: "Error-Handling-Module",
        timestamp: new Date().toISOString()
    });
};
exports.sendFault = sendFault;
//# sourceMappingURL=response.js.map