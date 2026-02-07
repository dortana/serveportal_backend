import { runWithI18n } from "@/utils/i18nContext";
import type { Request, NextFunction } from "express";

export const i18nContextMiddleware = (
  req: Request,
  res: any,
  next: NextFunction,
) => {
  if (typeof res.__ !== "function" || typeof res.getLocale !== "function") {
    return next();
  }

  const t = res.__.bind(res);
  const locale = res.getLocale();

  runWithI18n(t, locale, () => {
    next();
  });
};
