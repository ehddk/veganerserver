"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("@/api/common/exceptions/http.exception"));
function errorHandler(err, _, res, next) {
    if (err instanceof http_exception_1.default) {
        return res.status(err.statusCode).send({
            message: "client Error",
            details: err.message,
            code: err.cause,
        });
    }
    if (err instanceof Error) {
        res.status(500).send({
            message: "Internal Server Error",
            details: err.message,
        });
    }
    next();
}
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map