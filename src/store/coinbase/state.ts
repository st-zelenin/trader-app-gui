import { AllAverages, Balances, PairOpenOrders, Tickers } from '../../models';

export interface CoinbaseState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: PairOpenOrders;
  balances: Balances;
}
