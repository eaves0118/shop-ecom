import { Schema, model, Document, Types } from "mongoose";

interface TokenDocument extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}

const tokenSchema = new Schema<TokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<TokenDocument>("RefreshToken", tokenSchema);
