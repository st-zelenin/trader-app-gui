import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL_CRYPTO } from '../constants';
import {
  AllAverages,
  Averages,
  Balances,
  ExchangeService,
  OpenOrdersByPairs,
  Products,
  Tickers,
} from '../models';

@Injectable({ providedIn: 'root' })
export class CryptoComService implements ExchangeService {
  private readonly httpClient = inject(HttpClient);

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL_CRYPTO}/GetTickers`);
  }

  public getCurrencyPairs() {
    return this.httpClient.get<string[]>(`${API_URL_CRYPTO}/GetCurrencyPairs`);
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL_CRYPTO}/GetBalances`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL_CRYPTO}/GetAverages`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL_CRYPTO}/GetOpenOrders`
    );
  }

  public getRecentBuyAverages() {
    return this.httpClient.get<Averages>(
      `${API_URL_CRYPTO}/GetRecentBuyAverages`
    );
  }

  public getProducts() {
    return this.httpClient.get<Products>(`${API_URL_CRYPTO}/GetProducts`);
  }
}
