export interface Order extends NewOrder {
  id: string;
  create_time_ms: string;
  update_time_ms: string;
  status: string;
  type: string;
  account: string;
  left: string;
  filled_total: string;
  fee: string;
  fee_currency: string;
  point_fee: string;
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
