import { ArticleService } from "../service/article.service.type";
import { NextFunction, Request, Response } from "express";
export default class ArticleController {
    private readonly _articleService;
    constructor(articleService: ArticleService);
    getArticles(req: Request<getArticlesRequest["params"], getArticlesRequest["body"], getArticlesResponse, getArticlesRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    getArticleById(req: Request<getArticleRequest["path"], getArticleRequest["body"], getArticleRequest["params"], getArticleResponse>, res: Response, next: NextFunction): Promise<void>;
    createArticle(req: Request<createArticleRequest["params"], createArticleResponse, createArticleRequest["body"], createArticleRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    updateArticle(req: Request<updateArticleRequest["path"], updateArticleResponse, updateArticleRequest["body"], updateArticleRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    deleteArticle(req: Request<deleteArticleRequest["path"], deleteArticleRequest["body"], deleteArticleRequest["params"], deleteArticleResponse>, res: Response, next: NextFunction): Promise<void>;
}
