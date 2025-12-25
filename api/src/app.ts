import express from "express";
const app = express();
import {connection} from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";

app.use(express.json())
app.use(cookieParser());

connection()

app.use("/api/auth", authRouter)

export default app;