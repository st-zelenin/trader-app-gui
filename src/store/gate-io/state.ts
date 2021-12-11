import { AllAverages, Balances, PairOpenOrders, Tickers } from '../../models';

export interface State {
  tickers: Tickers;
  analytics: AllAverages;
  openOrders: PairOpenOrders;
  balances: Balances;
}
