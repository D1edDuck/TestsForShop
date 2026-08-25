import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";

export async function stats(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getStats();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function users(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getUsers();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function orders(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getOrders();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
