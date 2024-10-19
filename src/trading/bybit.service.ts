import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL_BYBIT } from '../constants';
import { AllAverages, Averages, Balances, ExchangeService, OpenOrdersByPairs, Products, Tickers } from '../models';

@Injectable({ providedIn: 'root' })
export class BybitService implements ExchangeService {
  private readonly httpClient = inject(HttpClient);

  public getTickers(): Observable<Tickers> {
    return this.httpClient.get<Tickers>(`${API_URL_BYBIT}/GetTickers`);
  }

  public getCurrencyPairs(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API_URL_BYBIT}/GetCurrencyPairs`);
  }

  public getBalances(): Observable<Balances> {
    return this.httpClient.get<Balances>(`${API_URL_BYBIT}/GetBalances`);
  }

  public getAverages(): Observable<AllAverages> {
    return this.httpClient.get<AllAverages>(`${API_URL_BYBIT}/GetAverages`);
  }

  public getAllOpenOrders(): Observable<OpenOrdersByPairs> {
    return this.httpClient.get<OpenOrdersByPairs>(`${API_URL_BYBIT}/GetOpenOrders`);
  }

  public getRecentBuyAverages(): Observable<Averages> {
    return this.httpClient.get<Averages>(`${API_URL_BYBIT}/GetRecentBuyAverages`);
  }

  public getProducts(): Observable<Products> {
    return this.httpClient.get<Products>(`${API_URL_BYBIT}/GetProducts`);
  }
}
