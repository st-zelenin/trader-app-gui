import { Observable } from 'rxjs';
import { Balance } from './balances';
import { Order } from './orders';
import { Ticker } from './tickers';
import { PairAverages } from './trade-averages';

export interface ExchangeStateFacade {
  balance: (currency: string) => Observable<Balance>;
  ticker: (id: string) => Observable<Ticker>;
  analytics: (id: string) => Observable<PairAverages>;
  pairOpenOrders: (currencyPair: string) => Observable<Order[]>;

  getTickers(): void;
  getAnalytics(): void;
  getOpenOrders(): void;
  getBalances(): void;
}
