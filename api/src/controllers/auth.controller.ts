import { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);

      return res.status(201).json({
        message: "Register successfully",
        user: result.createAt,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Register failed",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Login failed",
      });
    }
  }
}

export default AuthController