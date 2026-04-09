"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Technical Registry Storage Protocol:
// Temporarily storing uploaded files for AI mechanical analysis.
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf", ".csv", ".doc", ".docx"];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File Type Fault: ${ext} is not supported by the mechanical registry.`));
    }
};
/**
 * TECHNICAL REGISTRY UPLOAD MIDDLEWARE
 * Handles administrative talent profile uploads (PDF/CSV).
 */
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB System Limit
    }
});
//# sourceMappingURL=upload.middleware.js.map