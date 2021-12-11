import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from './constants';
import {
  AllAverages,
  Balances,
  CurrencyPair,
  NewOrder,
  Order,
  PairAverages,
  PairOpenOrders,
  Tickers,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private httpClient: HttpClient) {}

  public importAll(pair: string) {
    return this.httpClient.get(`${API_URL}/importAllHistory`, {
      params: { pair },
    });
  }

  public updateRecent(pair: string) {
    return this.httpClient.get(`${API_URL}/updateRecentHistory`, {
      params: { pair },
    });
  }

  public getHistory(pair: string) {
    return this.httpClient
      .get<{ total: number; res: Order[] }>(`${API_URL}/getHistory`, {
        params: { pair },
      })
      .pipe(map(({ res }) => res));
  }

  public calcAverages(pair: string) {
    return this.httpClient.get<PairAverages>(`${API_URL}/analyzeTrades`, {
      params: { pair },
    });
  }

  public getSingleTickerInfo(pair: string) {
    return this.httpClient
      .get<Tickers>(`${API_URL}/tickerInfo`, {
        params: { pair },
      })
      .pipe(map((tickers) => (tickers ? tickers[pair] : undefined)));
  }

  public getAllTickers() {
    return this.httpClient.get<Tickers>(`${API_URL}/tickerInfo`);
  }

  public getAllAnalytics() {
    return this.httpClient.get<PairAverages[]>(`${API_URL}/getAllAnalytics`);
  }

  public getOpenOrders(pair: string) {
    return this.httpClient.get<Order[]>(`${API_URL}/getOpenOrders`, {
      params: { pair },
    });
  }

  public getAllOpenOrders() {
    return this.httpClient.get<PairOpenOrders>(`${API_URL}/getAllOpenOrders`);
  }

  public cancelOrder(order: Order) {
    return this.httpClient.delete(`${API_URL}/cancelOrder`, {
      params: { id: order.id, pair: order.currency_pair },
    });
  }

  public createOrder(order: NewOrder) {
    return this.httpClient.post(`${API_URL}/createOrder`, {
      order,
    });
  }

  public getCurrencyPairs() {
    return this.httpClient.get<CurrencyPair[]>(`${API_URL}/getCurrencyPairs`);
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL}/getBalance`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/getAverages`);
  }
}
