import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.js";

dotenv.config();
const frontend_url = process.env.FRONTEND_URL as string;

if(!frontend_url){
  throw Error("Frontend url is not loaded from env")
}
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [frontend_url],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(authRouter)
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

async function main() {
  await connectDB();
  app.listen(process.env.PORT, () =>
    console.log("app is running on port " + process.env.PORT)
  );
}

main();
