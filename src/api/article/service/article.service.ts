import HttpException from "@/api/common/exceptions/http.exception";
import {
  ArticleResponseDTO,
  PaginatedArticleResponseDTO,
} from "../dto/articleResponse.dto";
import { ArticleRepository } from "@/api/article/repository/article.repository";
import { ArticleService } from "./article.service.type";
import { IArticle } from "../@types/article.type";

export class ArticleServicesImpl implements ArticleService {
  private readonly _articleRepository: ArticleRepository;

  constructor(articleRepository: ArticleRepository) {
    this._articleRepository = articleRepository;
  }
  async getArticles(
    limit: number,
    offset: number
  ): Promise<PaginatedArticleResponseDTO> {
    try {
      const values = await this._articleRepository.findAll(limit, offset);
      console.log("서비스에서 벨루", values);
      return values;
    } catch (error) {
      throw new Error("목록 조회 중 오류 발생");
    }
  }
  async getArticleById(id: string): Promise<ArticleResponseDTO | null> {
    try {
      const article = await this._articleRepository.findById(id);

      if (!article) {
        throw new HttpException(404, "해당 게시글을 찾을 수 없습니다.");
      }
      return new ArticleResponseDTO(article);
    } catch (error) {
      throw new Error("게시글 조회 중 오류 발생");
    }
  }
  async createArticle(
    article: Omit<IArticle, "id">
  ): Promise<ArticleResponseDTO> {
    try {
      const newArticle = await this._articleRepository.save(article);
      return new ArticleResponseDTO(newArticle);
    } catch (error) {
      throw new Error("게시글 생성 중 오류 발생");
    }
  }
  async updateArticle(
    id: string,
    articleInfo: Omit<ArticleResponseDTO, "id" | "author_id">
  ): Promise<void> {
    try {
      const updatedArticle = await this._articleRepository.update(
        id,
        articleInfo
      );
      console.log("업데이트", updatedArticle);
      if (!updatedArticle) {
        throw new HttpException(404, "해당 게시글을 찾을 수 없습니다.");
      }
    } catch (error) {
      throw new Error("게시글 수정 중 오류 발생");
    }
  }
  async deleteArticle(id: string): Promise<void> {
    try {
      await this._articleRepository.delete(id);
    } catch (error) {
      throw new Error("게시글 삭제 중 오류 발생");
    }
  }
}
