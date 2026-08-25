import { Request, Response, NextFunction } from "express";
import * as cartService from "./cart.service";

export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await cartService.getCart(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await cartService.addItem(req.user!.id, req.body);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const item = await cartService.updateItem(req.user!.id, itemId, req.body);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    await cartService.removeItem(req.user!.id, itemId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
