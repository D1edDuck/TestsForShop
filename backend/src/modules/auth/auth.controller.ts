import { Request, Response, NextFunction } from "express";
import { config } from "../../config";
import * as authService from "./auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "lax" as const,
  maxAge: config.cookieMaxAge,
};

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    res.cookie("token", result.token, COOKIE_OPTIONS);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.cookie("token", result.token, COOKIE_OPTIONS);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.status(204).end();
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
