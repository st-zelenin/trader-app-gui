import { Observable } from 'rxjs';
import { Balances } from './balances';
import { OpenOrdersByPairs } from './orders';
import { Tickers } from './tickers';
import { AllAverages } from './trade-averages';

export interface ExchangeService {
  getTickers(): Observable<Tickers>;
  getAllOpenOrders(): Observable<OpenOrdersByPairs>;
  getCurrencyPairs(): Observable<string[]>;
  getBalances(): Observable<Balances>;
  getAverages(): Observable<AllAverages>;
}
