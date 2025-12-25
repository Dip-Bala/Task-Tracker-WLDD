import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  id: String;
  role: "USER" | "ADMIN";
}
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const token = req.cookies?.access_token;

//   console.log("token", token);

  if (!token) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findOne({ _id: decoded.id  });
    // @ts-ignore
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
