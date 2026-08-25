export interface ProductQuery {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock?: number;
  image?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
