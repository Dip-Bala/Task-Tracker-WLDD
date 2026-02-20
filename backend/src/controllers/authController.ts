import { Request, Response } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import z from "zod";
import jwt from "jsonwebtoken";

const BaseUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const SignUpSchema = BaseUserSchema.extend({
  name: z.string().min(1),
});

export const LoginSchema = BaseUserSchema.pick({
  email: true,
  password: true,
});

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT Secret is not loaded from .env");
  }
  return secret;
}

async function findUser(email: string) {
  const user = await User.findOne({ email });
  return user;
}

export const SignUpController = async (req: Request, res: Response) => {
  const result = SignUpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.flatten(),
    });
  }

  const { name, email, password } = result.data;

  const existingUser = await findUser(email);
  if (existingUser) {
    return res.status(409).json({
      message: "User with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "User registration successful.",
  });
};

export const LoginController = async (req: Request, res: Response) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.flatten(),
    });
  }

  const { email, password } = result.data;

  const user = await findUser(email);
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: user._id.toString() }, getJwtSecret(), {
    expiresIn: "1h",
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login successful.",
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
};

export const MeController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const LogoutController = async (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.status(200).json({ message: "Logged out" });
};
