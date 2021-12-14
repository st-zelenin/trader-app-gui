import { AllAverages, Balances, PairOpenOrders, Tickers } from '../../models';

export interface CryptoComState {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: PairOpenOrders;
  balances: Balances;
}
