"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    statusCode;
    constructor(statusCode = 500, data) {
        super(typeof data === "string" ? data : data.message);
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.default = HttpException;
//# sourceMappingURL=http.exception.js.map