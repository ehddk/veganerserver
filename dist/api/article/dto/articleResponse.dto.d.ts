import { IArticle, PaginatedArticles } from "../@types/article.type";
export declare class ArticleResponseDTO {
    id: string;
    author_id?: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt?: Date;
    viewCount: number;
    constructor(params: IArticle);
}
export declare class PaginatedArticleResponseDTO {
    items: ArticleResponseDTO[];
    total: number;
    constructor(params: PaginatedArticles);
}
