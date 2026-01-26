"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("@/api/common/exceptions/http.exception"));
class ArticleController {
    _articleService;
    constructor(articleService) {
        this._articleService = articleService;
        this.getArticles = this.getArticles.bind(this);
        this.getArticleById = this.getArticleById.bind(this);
        this.createArticle = this.createArticle.bind(this);
        this.updateArticle = this.updateArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
    }
    async getArticles(req, res, next) {
        try {
            const rawLimit = req.query.limit;
            const rawOffset = req.query.offset;
            const parsedLimit = parseInt(Array.isArray(rawLimit) ? rawLimit[0] : rawLimit || "", 10);
            const parsedOffset = parseInt(Array.isArray(rawOffset) ? rawOffset[0] : rawOffset || "", 10);
            const limit = isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
            const offset = isNaN(parsedOffset) || parsedOffset < 0 ? 0 : parsedOffset;
            console.log("컨트롤러 offset", offset);
            const values = await this._articleService.getArticles(limit, offset);
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "목록 조회 중 오류 발생");
        }
    }
    async getArticleById(req, res, next) {
        const { id } = req.params;
        try {
            const values = await this._articleService.getArticleById(id);
            res.status(200).json(values);
        }
        catch (error) {
            throw new http_exception_1.default(404, "게시글 조회 중 오류 발생");
        }
    }
    async createArticle(req, res, next) {
        try {
            const { title, content, author, author_id } = req.body;
            const values = await this._articleService.createArticle({
                title,
                content,
                author,
                author_id,
            });
            res.status(201).json(values);
        }
        catch (error) {
            console.error("❌ 게시글 생성 에러:", error);
            throw new http_exception_1.default(404, "게시글 생성 중 오류 발생");
        }
    }
    async updateArticle(req, res, next) {
        const { id } = req.params;
        console.log("수정 id", req.body);
        try {
            await this._articleService.updateArticle(id, req.body);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "게시글 수정 중 오류 발생");
        }
    }
    async deleteArticle(req, res, next) {
        const { id } = req.params;
        try {
            await this._articleService.deleteArticle(id);
            res.status(204).json();
        }
        catch (error) {
            throw new http_exception_1.default(404, "게시글 삭제 중 오류 발생");
        }
    }
}
exports.default = ArticleController;
//# sourceMappingURL=article.controller.js.map