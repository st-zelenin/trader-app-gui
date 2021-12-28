import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';
import {
  AllAverages,
  Balances,
  ExchangeService,
  OpenOrdersByPairs,
  Tickers,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CoinbaseService implements ExchangeService {
  constructor(private httpClient: HttpClient) {}

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL}/coinbase_getTickers`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL}/coinbase_getOpenOrders`
    );
  }

  public getCurrencyPairs() {
    return this.httpClient.get<string[]>(
      `${API_URL}/coinbase_getCurrencyPairs`
    );
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL}/coinbase_getBalances`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/coinbase_getAverages`);
  }
}
