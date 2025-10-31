import express from "express";
import AuthController from "../controller/auth.controller";
import { DbAuthRepository } from "../repository/dbAuth.repository";
import { AuthServicesImpl } from "../service/auth.service";
export const authRouter = express.Router();

const authController = new AuthController(
  new AuthServicesImpl(new DbAuthRepository())
);

authRouter.get("/:id", authController.getAuthById);
authRouter.post("/", authController.createAuth);
authRouter.put("/:id", authController.updateAuth);
authRouter.delete("/:id", authController.deleteAuth);
authRouter.post("/login", authController.login);
