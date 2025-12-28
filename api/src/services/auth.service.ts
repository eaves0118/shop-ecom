import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import crypto from "crypto";
import RefreshToken from "../models/token.model.js";

interface BaseAuthData {
  email: string;
  password: string;
}

interface RegisterData extends BaseAuthData {}

interface LoginData extends BaseAuthData {}

class AuthService {
  static async register(data: RegisterData) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLocaleLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    return {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      createAt: newUser.createdAt,
    };
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Invalid credentials");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // 1️⃣ Revoke refresh token cũ
    await RefreshToken.updateMany(
      { userId: user._id, revokedAt: null },
      { revokedAt: new Date() }
    );

    // 2️⃣ Tạo access token
    const accessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      ENV.SECRET_KEY,
      { expiresIn: "1m" }
    );

    // 3️⃣ Tạo refresh token mới
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // 4️⃣ LƯU refresh token vào DB
    await RefreshToken.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async refreshToken(token: string) {
    if (!token) {
      throw new Error("Refresh token is required");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const storedToken = await RefreshToken.findOne({
      tokenHash: tokenHash,
      revokedAt: null,
    });

    if (!storedToken) {
      throw new Error("Invalid or revoked refresh token");
    }

    if (storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token expired");
    }

    const user = await User.findById(storedToken.userId);

    if (!user) {
      throw new Error("User not found");
    }

    storedToken.revokedAt = new Date();
    await storedToken.save();

    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      ENV.SECRET_KEY,
      { expiresIn: "1m" }
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async revokeRefreshToken(token: string) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await RefreshToken.findOneAndUpdate(
      { tokenHash: hash },
      { revokedAt: new Date() }
    );
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default AuthService;
