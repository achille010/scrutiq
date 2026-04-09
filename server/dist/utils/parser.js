"use strict";
/**
 * TECHNICAL TEXT PARSER UTILITY
 * Handles normalization of candidate dossier text for AI analysis.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCandidateName = exports.normalizeRegistryText = void 0;
const normalizeRegistryText = (text) => {
    return text
        .replace(/[\r\n]+/g, " ") // Flatten line breaks
        .replace(/\s{2,}/g, " ") // Standardize spacing
        .trim();
};
exports.normalizeRegistryText = normalizeRegistryText;
const extractCandidateName = (filename) => {
    return filename
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[-_]/g, " ") // Replace separators
        .toUpperCase(); // Admin Standard
};
exports.extractCandidateName = extractCandidateName;
//# sourceMappingURL=parser.js.map