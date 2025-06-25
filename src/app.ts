import express from "express";
import path from "node:path";
import { articleRouter } from "./api/article/router/article.router";
import errorHandler from "./api/common/middlewares/errorHandler.middleware";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/articles", articleRouter);

app.use(express.json());
app.listen(4000, () => {
  console.log(`Server is running on port 4000`);
});
