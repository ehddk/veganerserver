import express from "express";
import path from "node:path";
import { articleRouter } from "./api/article/router/article.router";
import errorHandler from "./api/common/middlewares/errorHandler.middleware";
import cors from "cors";
import { commentRouter } from "./api/comment/router/comment.router";
import { resRouter } from "./api/restaurant/router/res.router";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/restaurant", resRouter);

app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
