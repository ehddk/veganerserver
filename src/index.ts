// index.ts

import "@/envs";

import express from "express";
import { articleRouter } from "./api/article/router/article.router";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("서버 정상 작동 중!");
});

app.use("/api/articles", articleRouter);

app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
