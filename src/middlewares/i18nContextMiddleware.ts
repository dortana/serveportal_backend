import { runWithI18n } from "@/utils/i18nContext";
import { Request, Response, NextFunction } from "express";

export const i18nContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  runWithI18n(res.__.bind(res), res.getLocale(), () => next());
};
