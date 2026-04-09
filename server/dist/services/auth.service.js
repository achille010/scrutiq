"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../models/User.model"));
class AuthService {
    async getAllUsers() {
        return await User_model_1.default.find({});
    }
    async findUserByEmail(email) {
        return await User_model_1.default.findOne({ email });
    }
    async createUser(userData) {
        const newUser = new User_model_1.default({
            fullName: userData.fullName,
            email: userData.email,
            passwordHash: userData.passwordHash,
            companyName: userData.companyName,
            isVerified: false,
            role: "recruiter"
        });
        return await newUser.save();
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map