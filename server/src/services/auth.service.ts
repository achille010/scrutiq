import User, { IUser } from "../models/User.model";
import bcrypt from "bcryptjs";

class AuthService {
  async getAllUsers() {
    return await User.find({});
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findUserByCode(code: string) {
    return await User.findOne({ verificationCode: code });
  }

  async createUser(userData: Partial<IUser>) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.passwordHash!, salt);
    
    // Generate a numeric 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      id: `USR-${Math.floor(100 + Math.random() * 899)}`,
      fullName: userData.fullName,
      email: userData.email,
      passwordHash: passwordHash,
      companyName: userData.companyName,
      isVerified: false,
      verificationCode: verificationCode,
      role: "recruiter"
    });
    
    return await newUser.save();
  }

  async verifyPassword(raw: string, hash: string) {
    return await bcrypt.compare(raw, hash);
  }
}

export default new AuthService();
