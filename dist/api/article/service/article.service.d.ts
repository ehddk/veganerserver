import { ArticleResponseDTO, PaginatedArticleResponseDTO } from "../dto/articleResponse.dto";
import { ArticleRepository } from "../../../api/article/repository/article.repository";
import { ArticleService } from "./article.service.type";
import { IArticle } from "../@types/article.type";
export declare class ArticleServicesImpl implements ArticleService {
    private readonly _articleRepository;
    constructor(articleRepository: ArticleRepository);
    getArticles(limit: number, offset: number): Promise<PaginatedArticleResponseDTO>;
    getArticleById(id: string): Promise<ArticleResponseDTO | null>;
    createArticle(article: Omit<IArticle, "id">): Promise<ArticleResponseDTO>;
    updateArticle(id: string, articleInfo: Omit<ArticleResponseDTO, "id" | "author_id">): Promise<void>;
    deleteArticle(id: string): Promise<void>;
}
