import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import { Pool } from "mysql2/promise";
import { initializeRoutes } from "./routes/web";

export const createApp = (db: Pool): Application => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Attach db to app locals for access in controllers
  app.locals.db = db;

  // Initialize routes
  initializeRoutes(app, db);

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      message: "Internal server error",
      status: false,
      timestamp: Date.now(),
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      message: "Route not found",
      status: false,
      timestamp: Date.now(),
    });
  });

  return app;
};

export default createApp;
