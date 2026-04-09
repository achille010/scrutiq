"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    /**
     * HELP: Simple Register Logic
     * Saves a new user and sends a confirmation message.
     */
    async register(req, res) {
        try {
            const { fullName, email, password, companyName } = req.body;
            if (!fullName || !email || !password || !companyName) {
                return res.status(400).json({ status: "fault", message: "Please fill in all fields." });
            }
            const existingUser = await auth_service_1.default.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ status: "fault", message: "This email is already registered." });
            }
            const newUser = await auth_service_1.default.createUser({
                fullName,
                email,
                passwordHash: password,
                companyName
            });
            return res.status(201).json({
                status: "success",
                message: "Registration successful. Please check your email to verify your account.",
                data: { userId: newUser.id }
            });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
    /**
     * HELP: Simple Login Logic
     * Checks email and password to give access.
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Allow demo login
            if (email === "admin@umurava.africa" && password === "umurava2026") {
                return res.status(200).json({
                    status: "success",
                    data: {
                        user: { id: "USR-217", name: "Senior Recruiter", company: "Umurava", role: "admin" }
                    }
                });
            }
            const user = await auth_service_1.default.findUserByEmail(email);
            if (!user || user.passwordHash !== password) {
                return res.status(401).json({ status: "fault", message: "Wrong email or password." });
            }
            return res.status(200).json({
                status: "success",
                data: {
                    user: {
                        id: user.id,
                        name: user.fullName,
                        company: user.companyName,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            return res.status(500).json({ status: "fault", message: error.message });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map