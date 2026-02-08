"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const article_router_1 = require("./api/article/router/article.router");
const errorHandler_middleware_1 = __importDefault(require("./api/common/middlewares/errorHandler.middleware"));
const cors_1 = __importDefault(require("cors"));
const comment_router_1 = require("./api/comment/router/comment.router");
const res_router_1 = require("./api/restaurant/router/res.router");
const review_router_1 = require("./api/review/router/review.router");
const auth_router_1 = require("./api/auth/router/auth.router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// app.options("/(.*)", (req, res) => {
//   res.sendStatus(200);
// });
app.use("/api/articles", article_router_1.articleRouter);
app.use("/api/comments", comment_router_1.commentRouter);
app.use("/api/restaurant", res_router_1.resRouter);
app.use("/api/review", review_router_1.reviewRouter);
app.use("/api/auth", auth_router_1.authRouter);
app.use(errorHandler_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map