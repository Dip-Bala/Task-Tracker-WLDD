import {Router} from 'express';
import Task from '../models/taskSchema.js';
import { Request, Response } from 'express';

export async function addTask(req: Request, res: Response){
    const {title, description, status} = req.body;
    const user = req.user;

    try{
        const response = await Task.create({
            title,
            description, 
            status,
            user: user?.id
        });
        console.log(response)
        return res.json({
            task: response,
            message: "New Task added successfully",
            status: 200
        })
    }catch(e){
        console.log(e);
        return res.json({
            message: ""
        })
    }
}

export async function getAllTask(req: Request, res: Response){
    const user = req.user;
    let tasks = {};
    try{
        if(user?.role === 'ADMIN'){
            tasks = await Task.find({}).populate("user", "name email");;
            console.log(tasks);
        }else {
            tasks = await Task.find({
                user: user?.id, 
                // role: 'USER'
            })
        }
        console.log(tasks);
        return res.json({
            tasks: tasks,
            status: 200
        })
    }catch(e){
        console.log(e)
    }

}

export async function updateTask(req: Request, res: Response){
    // const 
}

export async function deleteTask(req: Request, res: Response){
    // const 
}