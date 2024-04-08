import { PRICE_SOURCE } from '../trading/order-form/constants';

export type OrderSide = 'buy' | 'sell';

export interface Order {
  id: string;
  currencyPair: string;
  createTimestamp: number;
  updateTimestamp: number;
  side: OrderSide;
  amount: number; // TODO: rename to quantity
  price: number;
  status: CommonOrderStatus;
  type: CommonOrderType;
}

export interface OrderRow extends Order {
  selected: boolean;
}

export interface SelectedOrdersInfo {
  amount: number;
  total: number;
  price: number;
}

export interface NewOrder extends OrderFormValues {
  currencyPair: string;
}

export interface OrderFormValues {
  side: OrderSide;
  price: number | null;
  amount: number | null;
  total: number | null;
  market: boolean;
}

export interface OpenOrdersByPairs {
  [key: string]: Order[];
}

export type CommonOrderStatus = 'closed' | 'open' | 'cancelled';
export type CommonOrderType = 'limit' | 'market';
