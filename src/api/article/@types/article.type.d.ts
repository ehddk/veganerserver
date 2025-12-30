interface IArticle {
  id: string;
  author_id: string;
  author: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  viewCount: number;
}

export interface PaginatedArticles {
  items: IArticle[];
  total: number;
}

export interface IArticleResponse {
  data: IArticle[];
}
