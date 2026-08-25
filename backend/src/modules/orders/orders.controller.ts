import { Request, Response, NextFunction } from "express";
import * as ordersService from "./orders.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.createOrder(req.user!.id, req.body);
    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await ordersService.getMyOrders(req.user!.id);
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Невалидный ID" });
    }
    const order = await ordersService.getOrderById(req.user!.id, id, req.user!.role);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await ordersService.updateStatus(req.user!.id, id, req.user!.role, req.body.status);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}
