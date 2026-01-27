"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentResponseDTO = void 0;
class CommentResponseDTO {
    id;
    user_id;
    content;
    user;
    createdAt;
    updatedAt;
    constructor(params) {
        (this.id = params.id),
            (this.user_id = params.user_id),
            (this.content = params.content),
            (this.user = params.user),
            (this.createdAt = params.createdAt),
            (this.updatedAt = params.updatedAt);
    }
}
exports.CommentResponseDTO = CommentResponseDTO;
//# sourceMappingURL=commentReponse.dto.js.map