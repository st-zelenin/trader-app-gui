import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';
import {
  AllAverages,
  Averages,
  Balances,
  ExchangeService,
  OpenOrdersByPairs,
  Tickers,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BybitService implements ExchangeService {
  constructor(private httpClient: HttpClient) {}

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL}/bybit_getTickers`);
  }

  public getCurrencyPairs() {
    return this.httpClient.get<string[]>(`${API_URL}/bybit_getCurrencyPairs`);
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL}/bybit_getBalances`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/bybit_getAverages`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL}/bybit_getOpenOrders`
    );
  }

  public getRecentBuyAverages() {
    return this.httpClient.get<Averages>(
      `${API_URL}/bybit_getRecentBuyAverages`
    );
  }
}
