import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env.js";

interface AuthPayload extends JwtPayload {
  userId: string;
  role: "user" | "admin";
}

interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Unauthorized"})
    }

    const [scheme, token] = authHeader.split(" ");

    if(scheme !== "Bearer" || !token){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const decoded = jwt.verify(token, ENV.SECRET_KEY) as AuthPayload

        req.user = decoded;

        next()
    }catch(error){
        return res.status(401).json({message: "Unauthorized"})
    }
};
