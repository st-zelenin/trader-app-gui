import { Balances, Tickers } from '../../models';

export interface CryptoComState {
  tickers: Tickers;
  // analytics: AllAverages;
  // openOrders: PairOpenOrders;
  balances: Balances;
}
