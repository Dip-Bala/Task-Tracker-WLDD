import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";

dotenv.config();

const frontend_url =
  process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [frontend_url],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

export default app;