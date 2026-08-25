export interface AddToCartDto {
  productId: number;
  quantity?: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
