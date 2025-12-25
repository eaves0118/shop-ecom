import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  role: "user" | "admin";
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, require: true, unique: true, trim: true },
    password: { type: String, require: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", userSchema);
