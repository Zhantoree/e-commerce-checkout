export type Product = {
  id: string;
  name: string;
  brand: Brand;
  price: number;
  rate: number;
  promoCodes: PromoCode[];
  imgUrls: string[] | null;
};

export type Brand = {
  id: string;
  name: string;
};

export const PromoCodeTypes = {
  percentage: "percentage",
  free_shipping: "free_shipping",
} as const;

export type PromoCode = {
  type: keyof typeof PromoCodeTypes;
  value: number;
  minOrder: number;
};
