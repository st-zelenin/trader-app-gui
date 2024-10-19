import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '../constants';
import { AllAverages, Averages, Balances, ExchangeService, OpenOrdersByPairs, Products, Tickers } from '../models';

@Injectable({ providedIn: 'root' })
export class CoinbaseService implements ExchangeService {
  private readonly httpClient = inject(HttpClient);

  public getTickers(): Observable<Tickers> {
    return this.httpClient.get<Tickers>(`${API_URL}/coinbase_getTickers`);
  }

  public getAllOpenOrders(): Observable<OpenOrdersByPairs> {
    return this.httpClient.get<OpenOrdersByPairs>(`${API_URL}/coinbase_getOpenOrders`);
  }

  public getCurrencyPairs(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API_URL}/coinbase_getCurrencyPairs`);
  }

  public getBalances(): Observable<Balances> {
    return this.httpClient.get<Balances>(`${API_URL}/coinbase_getBalances`);
  }

  public getAverages(): Observable<AllAverages> {
    return this.httpClient.get<AllAverages>(`${API_URL}/coinbase_getAverages`);
  }

  public getRecentBuyAverages(): Observable<Averages> {
    return this.httpClient.get<Averages>(`${API_URL}/coinbase_getRecentBuyAverages`);
  }

  public getProducts(): Observable<Products> {
    return this.httpClient.get<Products>(`${API_URL}/coinbase_getProducts`);
  }
}
