import { IArticle, PaginatedArticles } from "../@types/article.type";

export class ArticleResponseDTO {
  id: string;
  author_id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;

  constructor(params: IArticle) {
    this.id = params.id;
    this.author_id = params.author_id;
    this.title = params.title;
    this.content = params.content;
    this.author = params.author;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}

export class PaginatedArticleResponseDTO {
  items: ArticleResponseDTO[];
  total: number;

  constructor(params: PaginatedArticles) {
    this.items = params.items;
    this.total = params.total;
  }
}
