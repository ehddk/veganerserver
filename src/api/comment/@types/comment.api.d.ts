export interface IComment {
  id: string;
  article_id: string;
  author_id: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

declare global {
  /** 댓글 목록 조회 */
  type getCommentsRequestPath = {
    articleId: string;
  };
  type getCommentsRequestParams = {};

  type getCommentsResponse = IComment[];

  /** 댓글 생성 */
  type createCommentRequestPath = {};
  type createCommentRequestBody = {
    article_id: string;
    author_id: string;
    author: string;
    content: string;
  };
  type createCommentResponse = IComment;

  /** 댓글 수정 */
  type updateCommentRequestPath = {
    commentId: string;
  };
  type updateCommentRequestBody = {
    content: string;
    updatedAt: Date;
  };
  type updateCommentResponse = IComment;

  /** 댓글 삭제 */
  type deleteCommentRequestPath = {
    commentId: string;
  };
  type deleteCommentResponse = true; // 삭제 성공 여부

  namespace Comment {
    /**
     * @path /api/comments
     * @description
     */
    namespace GetList {
      type Params = {};
      type Path = {};
      type Body = {};
      type Request = {
        params?: Params;
        path: Path;
        body?: Body;
      };

      type Response = getCommentsResponse;
    }

    /**
     * @path /api/comments/:articleId
     * @description
     */
    namespace GetOne {
      type Params = {};
      type Path = { id: string };
      type Body = {};
      type Request = {
        params?: Params;
        path: Path;
        body?: Body;
      };

      type Response = getCommentsResponse;
    }

    /**
     * @path /api/comments
     * @description 댓글 생성
     */
    namespace Post {
      type Params = {};
      type Path = {};
      type Body = createCommentRequestBody;
      type Request = {
        params?: Params;
        path?: Path;
        body: Body;
      };
      type Response = createCommentResponse;
    }

    /**
     * @path /api/comments/:commentId
     * @description 댓글 수정
     */
    namespace Put {
      type Path = updateCommentRequestPath;
      type Params = {};
      type Body = updateCommentRequestBody;
      type Request = {
        path: Path;
        params?: Params;
        body: Body;
      };
      type Response = updateCommentResponse;
    }

    /**
     * @path /api/comments/:commentId
     * @description 댓글 삭제
     */
    namespace Delete {
      type Params = {};
      type Path = deleteCommentRequestPath;
      type Body = {};
      type Request = {
        path: Path;
        params?: Params;
        body?: Body;
      };
      type Response = deleteCommentResponse;
    }
  }
}
