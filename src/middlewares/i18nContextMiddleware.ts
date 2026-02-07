import { runWithI18n } from "@/utils/i18nContext";
import type { Request, Response, NextFunction } from "express";

export const i18nContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const t = res.__.bind(res);
  const locale = res.getLocale();

  runWithI18n(t, locale, () => {
    next();
  });
};
