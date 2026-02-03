import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import i18n from "i18n";
import routes from "@/routes";
import path from "path";

i18n.configure({
  locales: ["en-US", "hu-HU"],
  directory: path.join(__dirname, "./messages"),
  defaultLocale: "en-US",
  objectNotation: true,
});

const app: Express = express();

app.use(i18n.init);

app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(200)
    .json({ message: res.__("Welcome to the ServePortal API") });
});

export default app;
