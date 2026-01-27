import * as yup from "yup";
import type { Request, Response, NextFunction } from "express";
/** 모든 요청 validate 체크 */
export declare const validate: (schema: yup.AnyObject | {
    body?: yup.AnyObject;
    path?: yup.AnyObject;
    params?: yup.AnyObject;
}) => (req: Request, __: Response, next: NextFunction) => Promise<void>;
