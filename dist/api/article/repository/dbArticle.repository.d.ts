import { IArticle, PaginatedArticles } from "../@types/article.type";
import { ArticleRepository } from "./article.repository";
export declare class DbArticleRepository implements ArticleRepository {
    save(article: Omit<IArticle, "id">): Promise<IArticle>;
    findAll(limit: number, offset: number): Promise<PaginatedArticles>;
    findById(id: string): Promise<IArticle | null>;
    update(id: string, article: Partial<Omit<IArticle, "id" | "createdAt" | "author_id">>): Promise<IArticle | null>;
    delete(id: string): Promise<void>;
}
