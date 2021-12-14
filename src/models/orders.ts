export interface Order {
  id: string;
  currencyPair: string;
  createTimestamp: number;
  updateTimestamp: number;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  status: CommonOrderStatus;
}

export interface NewOrder {
  currency_pair: string;
  side: 'buy' | 'sell';
  amount: string;
  price: string;
}

export interface PairOpenOrders {
  [key: string]: Order[];
}

export type CommonOrderStatus = 'closed' | 'open' | 'cancelled';
