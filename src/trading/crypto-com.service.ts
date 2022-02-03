import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';
import {
  AllAverages,
  Averages,
  Balances,
  ExchangeService,
  OpenOrdersByPairs,
  Products,
  Tickers,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CryptoComService implements ExchangeService {
  constructor(private httpClient: HttpClient) {}

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL}/crypto_getTickers`);
  }

  public getCurrencyPairs() {
    return this.httpClient.get<string[]>(`${API_URL}/crypto_getCurrencyPairs`);
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL}/crypto_getBalances`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/crypto_getAverages`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL}/crypto_getOpenOrders`
    );
  }

  public getRecentBuyAverages() {
    return this.httpClient.get<Averages>(
      `${API_URL}/crypto_getRecentBuyAverages`
    );
  }

  public getProducts() {
    return this.httpClient.get<Products>(`${API_URL}/crypto_getProducts`);
  }
}
