export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { status: string; count: number }[];
  recentOrders: any[];
}
