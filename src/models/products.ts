export interface Product {
  currencyPair: string;
  minQuantity: number;
  minTotal: number;
  pricePrecision: number;
}

export interface Products {
  [key: string]: Product;
}
