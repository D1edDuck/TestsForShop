import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/errorHandler";
import { ProductQuery, CreateProductDto, UpdateProductDto, PaginatedResponse } from "./products.types";

export async function getAll(query: ProductQuery): Promise<PaginatedResponse<any>> {
  const where: Prisma.ProductWhereInput = {};

  if (query.category) {
    where.category = query.category;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { id: "asc" };
  switch (query.sort) {
    case "price_asc": orderBy = { price: "asc" }; break;
    case "price_desc": orderBy = { price: "desc" }; break;
    case "name": orderBy = { name: "asc" }; break;
    case "rating": orderBy = { rating: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
  }

  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take: limit }),
    prisma.product.count({ where }),
  ]);

  return {
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
}

export async function getCategories(): Promise<string[]> {
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => c.category);
}

export async function getById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    throw new AppError(404, "Товар не найден");
  }

  return product;
}

export async function create(dto: CreateProductDto) {
  const { name, description, price, category, stock, image } = dto;

  if (!name || !description || price === undefined || !category) {
    throw new AppError(400, "Обязательные поля: name, description, price, category");
  }

  if (typeof price !== "number" || price < 0) {
    throw new AppError(400, "Цена должна быть положительным числом");
  }

  return prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: image || "/images/placeholder.png",
    },
  });
}

export async function update(id: number, dto: UpdateProductDto) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Товар не найден");
  }

  if (dto.price !== undefined && (typeof dto.price !== "number" || dto.price < 0)) {
    throw new AppError(400, "Цена должна быть положительным числом");
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.image !== undefined && { image: dto.image }),
    },
  });
}

export async function remove(id: number) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Товар не найден");
  }

  await prisma.product.delete({ where: { id } });
}
