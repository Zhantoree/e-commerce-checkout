export type FilterItem = {
  id: string;
  name: string;
  quantity: number;
};

export type FilterTypes = "brands" | "prices" | "colors" | "discounts";

export type FilterData = { [key in FilterTypes]: FilterItem[] };
