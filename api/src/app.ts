import express from "express";
const app = express();
import { connection } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000", // ĐỊA CHỈ CHÍNH XÁC CỦA FRONTEND
    credentials: true, // CHO PHÉP GỬI COOKIE/TOKEN
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

connection();

app.use("/api/auth", authRouter);

export default app;
