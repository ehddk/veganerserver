import HttpException from "@/api/common/exceptions/http.exception";
import { ArticleService } from "../service/article.service.type";
import { NextFunction, Request, Response } from "express";

export default class ArticleController {
  private readonly _articleService: ArticleService;
  constructor(articleService: ArticleService) {
    this._articleService = articleService;

    this.getArticles = this.getArticles.bind(this);
    this.getArticleById = this.getArticleById.bind(this);
    this.createArticle = this.createArticle.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }
  async getArticles(
    req: Request<
      getArticlesRequest["params"],
      getArticlesRequest["body"],
      getArticlesResponse,
      getArticlesRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const rawLimit = req.query.limit;
      const rawOffset = req.query.offset;

      const parsedLimit = parseInt(
        Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "",
        10
      );
      const parsedOffset = parseInt(
        Array.isArray(rawOffset) ? rawOffset[0] : rawOffset || "",
        10
      );

      const limit: number =
        isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
      const offset: number =
        isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;

      console.log("컨트롤러 offset", offset);
      const values = await this._articleService.getArticles(limit, offset);
      res.status(200).json(values);
    } catch (error) {
      throw new HttpException(404, "목록 조회 중 오류 발생");
    }
  }

  async getArticleById(
    req: Request<
      getArticleRequest["path"],
      getArticleRequest["body"],
      getArticleRequest["params"],
      getArticleResponse
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    try {
      const values = await this._articleService.getArticleById(id);
      res.status(200).json(values);
    } catch (error) {
      throw new HttpException(404, "게시글 조회 중 오류 발생");
    }
  }
  async createArticle(
    req: Request<
      createArticleRequest["params"],
      createArticleResponse,
      createArticleRequest["body"],
      createArticleRequest["path"]
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title, content, author, author_id } = req.body;

      const values = await this._articleService.createArticle({
        title,
        content,
        author,
        author_id,
      });

      res.status(201).json(values);
    } catch (error) {
      console.error("❌ 게시글 생성 에러:", error);

      throw new HttpException(404, "게시글 생성 중 오류 발생");
    }
  }
  async updateArticle(
    req: Request<
      updateArticleRequest["path"],
      updateArticleResponse,
      updateArticleRequest["body"],
      updateArticleRequest["params"]
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    console.log("수정 id", req.body);
    try {
      await this._articleService.updateArticle(id, req.body);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "게시글 수정 중 오류 발생");
    }
  }
  async deleteArticle(
    req: Request<
      deleteArticleRequest["path"],
      deleteArticleRequest["body"],
      deleteArticleRequest["params"],
      deleteArticleResponse
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      await this._articleService.deleteArticle(id);
      res.status(204).json();
    } catch (error) {
      throw new HttpException(404, "게시글 삭제 중 오류 발생");
    }
  }
}
