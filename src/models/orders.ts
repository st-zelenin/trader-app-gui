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
  currencyPair: string;
  side: 'buy' | 'sell';
  amount: string;
  price: string;
  total: string;
  market: boolean;
}

export interface OpenOrdersByPairs {
  [key: string]: Order[];
}

export type CommonOrderStatus = 'closed' | 'open' | 'cancelled';
