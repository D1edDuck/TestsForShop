import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/errorHandler";
import { AddToCartDto, UpdateCartItemDto } from "./cart.types";

export async function getCart(userId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: { id: true, name: true, price: true, image: true, stock: true },
      },
    },
    orderBy: { id: "asc" },
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    data: items,
    total: Math.round(total * 100) / 100,
    count: items.length,
  };
}

export async function addItem(userId: number, dto: AddToCartDto) {
  const productId = typeof dto.productId === "string" ? parseInt(dto.productId as any, 10) : dto.productId;
  const quantity = dto.quantity || 1;

  if (!productId) {
    throw new AppError(400, "productId обязателен");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError(404, "Товар не найден");
  }

  if (product.stock < quantity) {
    throw new AppError(400, "Недостаточно товара на складе");
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      throw new AppError(400, "Недостаточно товара на складе");
    }

    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: {
        product: { select: { id: true, name: true, price: true, image: true, stock: true } },
      },
    });
  }

  return prisma.cartItem.create({
    data: { userId, productId, quantity },
    include: {
      product: { select: { id: true, name: true, price: true, image: true, stock: true } },
    },
  });
}

export async function updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
  const { quantity } = dto;

  if (!quantity || quantity < 1) {
    throw new AppError(400, "Количество должно быть >= 1");
  }

  const existing = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
    include: { product: true },
  });

  if (!existing) {
    throw new AppError(404, "Элемент корзины не найден");
  }

  if (quantity > existing.product.stock) {
    throw new AppError(400, "Недостаточно товара на складе");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: { select: { id: true, name: true, price: true, image: true, stock: true } },
    },
  });
}

export async function removeItem(userId: number, itemId: number) {
  const existing = await prisma.cartItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!existing) {
    throw new AppError(404, "Элемент корзины не найден");
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
}
