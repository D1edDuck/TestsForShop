import { Request, Response, NextFunction } from "express";
import * as productsService from "./products.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productsService.getAll(req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function categories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productsService.getCategories();
    res.json({ data });
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
    const data = await productsService.getById(id);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await productsService.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Невалидный ID" });
    }
    const data = await productsService.update(id, req.body);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Невалидный ID" });
    }
    await productsService.remove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
