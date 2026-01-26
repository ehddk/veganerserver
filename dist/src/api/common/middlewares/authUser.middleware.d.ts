import { Request, Response, NextFunction } from "express";
/** 인증 미들웨어 */
export declare const authUserMiddleware: (req: Request, res: Response, next: NextFunction) => void;
