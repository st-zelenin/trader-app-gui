import {
  Balances,
  Multiplicator,
  PairOpenOrders,
  Tickers,
  AllAverages,
} from '../models';

export interface State {
  buyMultiplicator: Multiplicator;
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: PairOpenOrders;
  balances: Balances;
}

export interface AppState {
  trading: State;
}
