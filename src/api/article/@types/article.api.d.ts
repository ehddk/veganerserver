import { IArticle } from "./article.type";

declare global {
  /**목록 조회 */
  type getArticlesRequestPath = {
    limit?: number;
    offset?: number;
  };
  type getArticlesRequestParams = {};
  type getAticlesRequestBody = {};
  type getArticlesRequest = {
    path: getArticlesRequestPath;
    params?: getArticlesRequestParams;
    body?: getArticlesRequestBody;
  };
  type getArticlesResponse = {
    items: IArticle[];
    total: number;
  };

  /**상세 조회 */
  type getArticleRequestPath = {
    id: string;
  };
  type getArticleRequestParams = {};
  type getArticleRequestBody = {};

  type getArticleRequest = {
    path: getArticleRequestPath;
    params?: getArticleRequestParams;
    body?: getArticleRequestBody;
  };
  type getArticleResponse = IArticle;

  /**생성 */
  type createArticleRequestPath = {};
  type createArticleRequestParams = {};
  type createArticleRequestBody = {
    title: string;
    content: string;
    author: string;
    author_id: string;
  };

  type createArticleRequest = {
    path?: createArticleRequestPath;
    params?: createArticleRequestParams;
    body: createArticleRequestBody;
  };
  type createArticleResponse = IArticle;

  /**수정 */
  type updateArticleRequestPath = { id: string };
  type updateArticleRequestParams = {};
  type updateArticleRequestBody = {
    title: string;
    content: string;
  };

  type updateArticleRequest = {
    path: updateArticleRequestPath;
    params?: updateArticleRequestParams;
    body: updateArticleRequestBody;
  };

  type updateArticleResponse = IArticle;

  /**삭제 */
  type deleteArticleRequestPath = {
    id: string;
  };
  type deleteArticleRequestParams = {};
  type deleteArticleRequestBody = {};
  type deleteArticleRequest = {
    path: deleteArticleRequestPath;
    params?: deleteArticleRequestParams;
    body?: deleteArticleRequestBody;
  };
  type deleteArticleResponse = true;
}

export {};
