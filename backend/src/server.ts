import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js'
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import taskRouter from './routes/task.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// app.use(authRouter)
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);


async function main(){
    await connectDB();
    app.listen(process.env.PORT, () => console.log('app is running on port ' + process.env.PORT))
}

main();
