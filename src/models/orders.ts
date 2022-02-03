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
}

export interface NewOrder extends OrderFormValues {
  currencyPair: string;
}

export interface OrderFormValues {
  side: OrderSide;
  amount: string;
  price: string;
  total: string;
  market: boolean;
}

export interface OpenOrdersByPairs {
  [key: string]: Order[];
}

export type CommonOrderStatus = 'closed' | 'open' | 'cancelled';
