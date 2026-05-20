export type CartLine = {
  productId: number;
  slug: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  updatedAt: string;
};
