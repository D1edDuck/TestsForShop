export interface CreateOrderDto {
  address: string;
  phone: string;
}

export interface UpdateStatusDto {
  status: string;
}

export const VALID_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
