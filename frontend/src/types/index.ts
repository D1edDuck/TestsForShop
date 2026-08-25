export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  text: string;
  rating: number;
  userId: number;
  productId: number;
  user: { id: number; name: string };
  createdAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  userId: number;
  productId: number;
  product: Product;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  address: string;
  phone: string;
  userId: number;
  user?: { id: number; name: string; email: string };
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  productId: number;
  product: { id: number; name: string; image: string; price?: number };
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { status: string; count: number }[];
  recentOrders: Order[];
}
