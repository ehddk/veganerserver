import express, { ErrorRequestHandler } from "express";
import { articleRouter } from "./api/article/router/article.router";
import errorHandler from "./api/common/middlewares/errorHandler.middleware";
import cors from "cors";
import { commentRouter } from "./api/comment/router/comment.router";
import { resRouter } from "./api/restaurant/router/res.router";
import { reviewRouter } from "./api/review/router/review.router";
import { authRouter } from "./api/auth/router/auth.router";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.options("/(.*)", (req, res) => {
//   res.sendStatus(200);
// });
app.get("/", (req, res) => {
  res.send("서버가 정상적으로 동작 중입니다!");
});

app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/restaurant", resRouter);
app.use("/api/review", reviewRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler as ErrorRequestHandler);

export default app;
