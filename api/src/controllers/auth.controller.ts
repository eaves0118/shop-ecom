import { Request, Response } from "express";
import AuthService from "../services/auth.service.js";

interface AuthRequest extends Request {
  user?: any;
}

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);

      return res.status(201).json({
        message: "Register successfully",
        user: result,
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

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
      const result = await AuthService.refreshToken(refreshToken);

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
        message: error.message || "Refresh token failed",
      });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.userId;

      const user = await AuthService.getMe(userId);

      return res.json(user);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  static async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await AuthService.revokeRefreshToken(refreshToken);
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    return res.json({ message: "Logged out" });
  }
}

export default AuthController;
