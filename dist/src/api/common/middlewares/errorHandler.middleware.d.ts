import { NextFunction, Request, Response } from "express";
declare function errorHandler(err: Error & {
    statusCode: number;
}, _: Request, res: Response, next: NextFunction): Response | void;
export default errorHandler;
