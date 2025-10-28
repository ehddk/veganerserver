import { IArticle, PaginatedArticles } from "../@types/article.type";

export class ArticleResponseDTO {
  id: string;
  author_id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;

  //이렇게 생성자에 속성을 할당해야하는 이유: 타입안정성을 위함.
  // 해당 클래스의 인스턴스가 생성되는 시점(=생성자)에 내가 필요한 속성(id,author_id 등등)에 유효값이 할당 되는지를 반드시 확인해야한다.
  //확인되지 않으면 런타임에 undefined될 위험이 있으니 컴파일을 막는 역할을 해줌

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
