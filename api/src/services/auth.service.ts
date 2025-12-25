import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import crypto from "crypto";
import RefreshToken from "../models/token.model.js"


interface BaseAuthData {
  username: string;
  password: string;
}

interface RegisterData extends BaseAuthData {}

interface LoginData extends BaseAuthData {}

class AuthService {
  static async register(data: RegisterData) {
    const { username, password } = data;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const normalizedUsername = username.trim().toLocaleLowerCase();

    const existingUser = await User.findOne({
      username: normalizedUsername,
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
      role: "user",
    });

    return {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      createAt: newUser.createdAt,
    };
  }

  static async login(data: LoginData) {
    const { username, password } = data;

    if (!username || !password) {
      throw new Error("Invalid credentials");
    }

    const normalizedUsername = username.trim().toLocaleLowerCase();

    const user = await User.findOne({ username: normalizedUsername }).select("+password");

   

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

 console.log(user?.password)

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      ENV.SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex")

    const refreshTokenHash  = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await RefreshToken.create({
        userId: user._id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    })

    return {
        accessToken,
        refreshToken: refreshToken,
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        }
    }
  }
}

export default AuthService;
