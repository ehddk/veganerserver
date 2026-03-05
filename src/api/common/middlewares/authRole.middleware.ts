import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import { createClient } from "@supabase/supabase-js";

/** 인증 & 인가 미들웨어 */
// export const authRoleMiddleware = (roles: RoleType[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       //let tokenValue: string | undefined;

//       // 헤더에서 토큰을 가져옵니다.
//       let token = req.cookies.accessToken;

//       // 2. 쿠키에 없으면 Authorization 헤더에서 확인합니다. (Postman 요청)
//       if (!token && req.headers.authorization) {
//         const parts = req.headers.authorization.split("Bearer ");
//         // Bearer <token> 형태인지 확인 후 토큰 값만 추출
//         if (parts.length === 2) {
//           token = parts[1];
//         }
//       }

//       console.log("token", token);

//       // 토큰이 없으면 에러를 던집니다.
//       if (!token) {
//         throw new HttpException(401, "토큰이 없습니다!!");
//       }

//       // 페이로드에서 역할을 확인합니다.
//       const payload = JwtService.verifyAccessToken(token);

//       // 역할이 없으면 에러를 던집니다.
//       if (!roles.includes(payload.role)) {
//         throw new HttpException(403, "권한이 없습니다.");
//       }

//       req.user = {
//         userId: payload.userId,
//         role: payload.role,
//       };

//       next();
//     } catch (error: any) {
//       next(
//         new HttpException(
//           error.statusCode ?? 401,
//           `인증 실패했습니다. ${error.message}`
//         )
//       );
//     }
//   };
// };

export const authRoleMiddleware = (roles: RoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      let token: string | undefined;

      // Authorization 헤더에서 토큰 추출
      if (req.headers.authorization) {
        const parts = req.headers.authorization.split("Bearer ");
        if (parts.length === 2) {
          token = parts[1];
        }
      }

      if (!token) {
        throw new HttpException(401, "토큰이 없습니다!!");
      }

      // Supabase로 토큰 검증 (JwtService 대신)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new HttpException(401, "유효하지 않은 토큰입니다.");
      }

      const role = user.user_metadata?.role ?? "user";
      const name = user.user_metadata?.name ?? "익명사용자";
      if (!roles.includes(role)) {
        throw new HttpException(403, "권한이 없습니다.");
      }

      req.user = {
        userId: user.id,
        role: role,
        name: name,
      };

      next();
    } catch (error: any) {
      next(
        new HttpException(
          error.statusCode ?? 401,
          `인증 실패했습니다. ${error.message}`
        )
      );
    }
  };
};
