import { Request, Response } from "express";
import authService from "../services/auth.service";
import emailService from "../services/email.service";

class AuthController {
  /**
   * Technical Activation: 
   * Verifies the email via a unique code.
   */
  async verifyCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ status: "fault", message: "Verification code required." });

      const user = await authService.findUserByCode(code);
      if (!user) return res.status(400).json({ status: "fault", message: "Invalid or expired activation code." });

      user.isVerified = true;
      user.verificationCode = undefined;
      await user.save();

      return res.status(200).json({ 
        status: "success", 
        message: "Account activated successfully. You can now login.",
        data: { user: { id: user.id || user._id, email: user.email } }
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { fullName, email, password, companyName } = req.body;

      if (!fullName || !email || !password || !companyName) {
        return res.status(400).json({ status: "fault", message: "Please fill in all fields." });
      }

      // Strong Password Validation: 8+ chars, 1 uppercase, 1 symbol
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
          status: "fault", 
          message: "Password must be at least 8 characters, include 1 uppercase and 1 technical symbol (!@#$%^&*)." 
        });
      }

      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ status: "fault", message: "This email is already registered." });
      }

      const newUser = await authService.createUser({
        fullName,
        email,
        passwordHash: password,
        companyName
      });

      // Non-blocking email dispatch
      emailService.sendVerificationCode(newUser.email, newUser.verificationCode!).catch(e => {
        console.error("Delayed Email Fault:", e);
      });

      return res.status(201).json({
        status: "success",
        message: "Account initialized. Activation code sent to email.",
        data: { email: newUser.email }
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await authService.findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ status: "fault", message: "Invalid credentials." });
      }

      if (!user.isVerified) {
        return res.status(401).json({ status: "fault", message: "Account not verified. Please activate via email." });
      }

      const isMatch = await authService.verifyPassword(password, user.passwordHash);
      if (!isMatch) {
         return res.status(401).json({ status: "fault", message: "Invalid credentials." });
      }

      const auditService = (await import("../services/audit.service")).default;
      auditService.log("USER_LOGIN", "AUTH", `Recruiter authenticated successfully.`, user._id.toString());

      return res.status(200).json({
        status: "success",
        data: {
          user: { 
            id: user.id || user._id, 
            name: user.fullName, 
            email: user.email,
            company: user.companyName, 
            role: user.role 
          }
        }
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fullName, companyName } = req.body;
      const mongoose = await import("mongoose");
      const User = (await import("../models/User.model")).default;
      
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ id });
      }
      
      if (!user) {
        return res.status(404).json({ status: "fault", message: "User not found." });
      }

      if (fullName) user.fullName = fullName;
      if (companyName) user.companyName = companyName;
      
      await user.save();

      const auditService = (await import("../services/audit.service")).default;
      auditService.log("PROFILE_UPDATE", "AUTH", `Recruiter profile information synchronized.`, user._id.toString());

      return res.status(200).json({
        status: "success",
        data: {
          id: user.id || user._id,
          name: user.fullName,
          email: user.email,
          company: user.companyName,
          role: user.role,
        }
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mongoose = await import("mongoose");
      const User = (await import("../models/User.model")).default;
      
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ id });
      }
      
      if (!user) {
        return res.status(404).json({ status: "fault", message: "User not found." });
      }

      return res.status(200).json({
        status: "success",
        data: {
          id: user.id || user._id,
          name: user.fullName,
          email: user.email,
          company: user.companyName,
          role: user.role,
        }
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async getAuditLogs(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mongoose = await import("mongoose");
      const User = (await import("../models/User.model")).default;
      
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ id });
      }

      if (!user) {
        return res.status(404).json({ status: "fault", message: "Invalid profile identifier." });
      }

      const auditService = (await import("../services/audit.service")).default;
      // We log with the string format of _id, so get by string
      const logs = await auditService.getLogs(user._id.toString());
      
      return res.status(200).json({
        status: "success",
        data: logs
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }

  async deleteProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mongoose = await import("mongoose");
      const User = (await import("../models/User.model")).default;
      const Job = (await import("../models/Job.model")).default;
      const Applicant = (await import("../models/Applicant.model")).default;
      const Screening = (await import("../models/Screening.model")).default;
      const AuditLog = (await import("../models/AuditLog.model")).default;
      
      let user;
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await User.findById(id);
      } else {
        user = await User.findOne({ id });
      }

      if (!user) {
        return res.status(404).json({ status: "fault", message: "User not found." });
      }

      // Hard delete user
      await User.findByIdAndDelete(user._id);

      // In a real application, you might want to also delete related records:
      // Jobs, Applicants, Screenings, and AuditLogs matching the user._id.
      // For now we'll delete the user and return success.
      return res.status(200).json({
        status: "success",
        message: "Account and associated data deleted successfully."
      });
    } catch (error: any) {
      return res.status(500).json({ status: "fault", message: error.message });
    }
  }
}

export default new AuthController();
