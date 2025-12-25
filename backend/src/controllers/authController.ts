import mongoose from 'mongoose';
import { Request, Response } from 'express';
import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
import z from 'zod';
import jwt from 'jsonwebtoken';

const {JWT_SECRET} = process.env;
if(!JWT_SECRET) {
    throw Error("JWT Secret is not loaded from .env")
}

const BaseUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6).max(20)
});
export const RegisterSchema = BaseUserSchema;
export const LoginSchema = BaseUserSchema.pick({
  email: true,
  password: true
});

type IUser = z.infer<typeof RegisterSchema>;

async function findUser(email: string){
    const user = await User.findOne({email: email});
    return user;
}
export const RegisterController = async(req: Request, res: Response) => {
    // const {name, email, password}:IUser = req.body;
    const result = RegisterSchema.safeParse(req.body);
    if(!result.success){
        return res.send({
            message: result.error,
            status: 403
        })
    }
    const {name, email, password} = result.data;
    // Check if the user is already signed up if yes return error
    const user = await findUser(email);
    if(user){
        return res.json({
            "message": "User with this email already exists",
            status: 401
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: 'USER'
    });

    return res.json({
        "message": "User registration successful."
    })
}

export const LoginController = async(req: Request, res: Response) => {
    // const {name, email, password}:IUser = req.body;
    const result = LoginSchema.safeParse(req.body);
    if(!result.success){
        return res.send({
            message: result.error,
            status: 403
        })
    }
    const {email, password} = result.data;

    const user = await findUser(email);
    if(!user){
        return res.json({
            "message": "No user with this email found",
            status: 401
        })
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.json({
            message: "The password does not match",
            status: 403
        })
    }
    // console.log(user);
    const token = jwt.sign({id: user._id.toString(), role: user.role}, JWT_SECRET, { expiresIn: '1h' });
    // console.log(token);
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
    return res.json({
        "message": "Login successful.",
        "user": {
            "name": user.name,
            "email": user.email,
            "role": user.role

        }
    })
}

export const MeController = async(req: Request, res: Response) => {
    const user = req.user;
    console.log(user);
    return res.json({
        status: 200,
        user: {
            name: user?.name,
            email: user?.email,
            role: user?.role
        }
    })
}