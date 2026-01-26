"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const dbAuth_repository_1 = require("../repository/dbAuth.repository");
const auth_service_1 = require("../service/auth.service");
exports.authRouter = express_1.default.Router();
const authController = new auth_controller_1.default(new auth_service_1.AuthServicesImpl(new dbAuth_repository_1.DbAuthRepository()));
exports.authRouter.get("/:id", authController.getAuthById);
exports.authRouter.post("/", authController.createAuth);
exports.authRouter.put("/:id", authController.updateAuth);
exports.authRouter.delete("/:id", authController.deleteAuth);
exports.authRouter.post("/login", authController.login);
exports.authRouter.post("/logout", authController.logout);
//# sourceMappingURL=auth.router.js.map