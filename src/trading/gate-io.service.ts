import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from '../constants';
import {
  AllAverages,
  Balances,
  ExchangeService,
  GateIoCurrencyPair,
  OpenOrdersByPairs,
  Order,
  Tickers,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class GateIoService implements ExchangeService {
  constructor(private httpClient: HttpClient) {}

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL}/tickerInfo`);
  }

  public getOpenOrders(pair: string) {
    return this.httpClient.get<Order[]>(`${API_URL}/getOpenOrders`, {
      params: { pair },
    });
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL}/getAllOpenOrders`
    );
  }

  public getCurrencyPairs() {
    return this.httpClient
      .get<GateIoCurrencyPair[]>(`${API_URL}/getCurrencyPairs`)
      .pipe(map((p) => p.map(({ id }) => id)));
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL}/getBalance`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/getAverages`);
  }
}
