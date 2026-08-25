import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateOrderDto } from "./orders.types";

export async function createOrder(userId: number, dto: CreateOrderDto) {
  const { address, phone } = dto;

  if (!address || !phone) {
    throw new AppError(400, "Адрес и телефон обязательны");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new AppError(400, "Корзина пуста");
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      throw new AppError(400, `Недостаточно товара "${item.product.name}" на складе (доступно: ${item.product.stock})`);
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        total: Math.round(total * 100) / 100,
        address,
        phone,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return order;
}

export async function getMyOrders(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(userId: number, orderId: number, userRole: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true, price: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    throw new AppError(404, "Заказ не найден");
  }

  if (order.userId !== userId && userRole !== "ADMIN") {
    throw new AppError(403, "Нет доступа к этому заказу");
  }

  return order;
}

export async function updateStatus(userId: number, orderId: number, userRole: string, status: string) {
  const VALID_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!VALID_STATUSES.includes(status)) {
    throw new AppError(400, `Невалидный статус. Допустимые: ${VALID_STATUSES.join(", ")}`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(404, "Заказ не найден");
  }

  if (order.userId !== userId && userRole !== "ADMIN") {
    throw new AppError(403, "Нет прав");
  }

  if (userRole !== "ADMIN" && status !== "CANCELLED") {
    throw new AppError(403, "Только админ может менять статус (кроме отмены)");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as any },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
}
