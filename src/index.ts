// index.ts

import "@/envs";

import express from "express";
import { articleRouter } from "./api/article/router/article.router";
import { commentRouter } from "./api/comment/router/comment.router";
import { resRouter } from "./api/restaurant/router/res.router";
import { reviewRouter } from "./api/review/router/review.router";
import { authRouter } from "./api/auth/router/auth.router";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("서버 정상 작동 중!");
});

app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/restaurant", resRouter);
app.use("/api/review", reviewRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
