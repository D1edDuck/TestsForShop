import prisma from "../../lib/prisma";

export async function getStats() {
  const [totalUsers, totalProducts, totalOrders, ordersByStatus, revenue, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: revenue._sum.total || 0,
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count.id })),
    recentOrders,
  };
}

export async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: { product: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
