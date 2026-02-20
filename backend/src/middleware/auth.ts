import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema";

interface JwtPayload {
  id: string;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret is not loaded from .env");
  }
  return secret;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
