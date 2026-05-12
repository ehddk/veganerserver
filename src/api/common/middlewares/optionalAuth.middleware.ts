import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

/**
 * 토큰이 있으면 검증해서 req.user를 채우고,
 * 없거나 검증 실패면 그냥 통과 (req.user는 undefined)
 *
 * 공개 페이지지만 로그인 여부에 따라 응답이 살짝 달라지는 경우 사용
 *  - 예: GET /api/restaurant/:id 에 scrapped_by_me를 채워주기
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization) {
      const parts = req.headers.authorization.split("Bearer ");
      if (parts.length === 2) {
        token = parts[1];
      }
    }

    if (!token) {
      return next();
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next();
    }

    req.user = {
      userId: user.id,
      role: user.user_metadata?.role ?? "user",
      name: user.user_metadata?.name ?? "익명사용자",
    };

    next();
  } catch {
    // 인증 실패 시 그냥 통과
    next();
  }
};
