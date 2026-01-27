import { AuthService } from "../service/auth.service.type";
import { NextFunction, Request, Response } from "express";
export default class AuthController {
    private readonly _authService;
    constructor(authService: AuthService);
    getAuthById(req: Request<getMemberRequest["path"], getMemberRequest["body"], getMemberRequest["params"], getMemberResponse>, res: Response, next: NextFunction): Promise<void>;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): Promise<void>;
    createAuth(req: Request<createMemberRequest["params"], createMemberResponse, createMemberRequest["body"], createMemberRequest["path"]>, res: Response, next: NextFunction): Promise<void>;
    updateAuth(req: Request<updateMemberRequest["path"], updateMemberResponse, updateMemberRequest["body"], updateMemberRequest["params"]>, res: Response, next: NextFunction): Promise<void>;
    deleteAuth(req: Request<deleteMemberRequest["path"], deleteMemberRequest["body"], deleteMemberRequest["params"], deleteMemberResponse>, res: Response, next: NextFunction): Promise<void>;
}
