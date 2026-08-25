import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "./errorHandler";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies?.token;

  if (!token) {
    throw new AppError(401, "Требуется авторизация");
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new AppError(401, "Невалидный токен");
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, "Требуется авторизация");
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new AppError(403, "Нет прав доступа");
    }

    next();
  };
}
