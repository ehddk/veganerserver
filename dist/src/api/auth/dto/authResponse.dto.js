"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDTO = void 0;
class AuthResponseDTO {
    id;
    name;
    email;
    password;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
    }
}
exports.AuthResponseDTO = AuthResponseDTO;
//# sourceMappingURL=authResponse.dto.js.map