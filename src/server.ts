import "dotenv/config";
import "module-alias/register";
import express, { Express, Request, Response, NextFunction } from "express";
import i18n from "i18n";
import routes from "@/routes";
import path from "path";
import { getTranslator } from "./utils/i18nContext";
import { i18nContextMiddleware } from "./middlewares/i18nContextMiddleware";

i18n.configure({
  locales: ["en-US", "hu-HU"],
  directory: path.join(__dirname, "./messages"),
  defaultLocale: "en-US",
  objectNotation: true,
});

const app: Express = express();

app.use(i18n.init);
app.use(i18nContextMiddleware);

app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  const t = getTranslator();
  return res
    .status(200)
    .json({ message: t("Welcome to the ServePortal API!!") });
});

export default app;
