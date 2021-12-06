import {
  AllAverages,
  Balances,
  Multiplicator,
  PairOpenOrders,
  Tickers,
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
