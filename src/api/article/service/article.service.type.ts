import { IArticle } from "../@types/article.type";
import {
  ArticleResponseDTO,
  PaginatedArticleResponseDTO,
} from "../dto/articleResponse.dto";

export interface ArticleService {
  /**목록 조회 */
  getArticles(
    limit: number,
    offset: number
  ): Promise<PaginatedArticleResponseDTO>;

  getArticleById(id: string): Promise<ArticleResponseDTO | null>;

  createArticle(
    article: Pick<IArticle, "title" | "content" | "author" | "author_id">
  ): Promise<ArticleResponseDTO>;

  updateArticle(
    id: string,
    articleInfo: Omit<IArticle, "id" | "author_id" | "author" | "createdAt">
  ): Promise<void>;

  deleteArticle(id: string): Promise<void>;
}
