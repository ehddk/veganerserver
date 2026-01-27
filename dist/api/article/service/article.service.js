"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleServicesImpl = void 0;
const http_exception_1 = __importDefault(require("@/api/common/exceptions/http.exception"));
const articleResponse_dto_1 = require("../dto/articleResponse.dto");
class ArticleServicesImpl {
    _articleRepository;
    constructor(articleRepository) {
        this._articleRepository = articleRepository;
    }
    async getArticles(limit, offset) {
        try {
            const values = await this._articleRepository.findAll(limit, offset);
            // console.log("서비스에서 벨루", values);
            return values;
        }
        catch (error) {
            throw new Error("목록 조회 중 오류 발생");
        }
    }
    async getArticleById(id) {
        try {
            const article = await this._articleRepository.findById(id);
            if (!article) {
                throw new http_exception_1.default(404, "해당 게시글을 찾을 수 없습니다.");
            }
            return new articleResponse_dto_1.ArticleResponseDTO(article);
        }
        catch (error) {
            throw new Error("게시글 조회 중 오류 발생");
        }
    }
    async createArticle(article) {
        try {
            const newArticle = await this._articleRepository.save(article);
            return new articleResponse_dto_1.ArticleResponseDTO(newArticle);
        }
        catch (error) {
            throw new Error("게시글 생성 중 오류 발생");
        }
    }
    async updateArticle(id, articleInfo) {
        try {
            const updatedArticle = await this._articleRepository.update(id, articleInfo);
            console.log("업데이트", updatedArticle);
            if (!updatedArticle) {
                throw new http_exception_1.default(404, "해당 게시글을 찾을 수 없습니다.");
            }
        }
        catch (error) {
            throw new Error("게시글 수정 중 오류 발생");
        }
    }
    async deleteArticle(id) {
        try {
            await this._articleRepository.delete(id);
        }
        catch (error) {
            throw new Error("게시글 삭제 중 오류 발생");
        }
    }
}
exports.ArticleServicesImpl = ArticleServicesImpl;
//# sourceMappingURL=article.service.js.map