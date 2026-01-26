import { IArticle, PaginatedArticles } from "../@types/article.type";
export interface ArticleRepository {
    /**목록 조회 */
    findAll(limit: number, offset: number): Promise<PaginatedArticles>;
    findById(id: string): Promise<IArticle | null>;
    save(article: Omit<IArticle, "id">): Promise<IArticle>;
    update(id: string, articleInfo: Partial<IArticle>): Promise<IArticle | null>;
    delete(id: string): Promise<void>;
}
