import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string; // Internal legacy support
  fullName: string;
  email: string;
  passwordHash: string;
  companyName: string;
  isVerified: boolean;
  verificationCode?: string;
  role: "admin" | "recruiter";
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    companyName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    role: { type: String, enum: ["admin", "recruiter"], default: "recruiter" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
