import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

export const initializeApp = async () => {
  if (initialized) return app;

  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  const publicPath = join(__dirname, "public");
  
  app.use(express.static(publicPath));
  
  app.get("*", (_req, res) => {
    const indexPath = join(publicPath, "index.html");
    if (existsSync(indexPath)) {
      res.send(readFileSync(indexPath, "utf-8"));
    } else {
      res.status(404).send("Not found");
    }
  });

  initialized = true;
  return app;
};

export default app;
