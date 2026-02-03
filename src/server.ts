import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";

import routes from "@/routes";

const app: Express = express();

app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "API is running and is healthy" });
});

export default app;
