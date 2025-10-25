import serverless from "serverless-http";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

const initializeApp = async () => {
  if (initialized) return app;

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  initialized = true;
  return app;
};

export default async (req: any, res: any) => {
  await initializeApp();
  const handler = serverless(app);
  return handler(req, res);
};
