// Think about i18n

import { FilterTypes } from "../(model)/types";

export const filterFieldToTitleMap: { [key in FilterTypes]: string } = {
  brands: "Brands",
  prices: "Prices",
  colors: "Colors",
  discounts: "Discounts",
};
