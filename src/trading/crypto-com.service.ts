import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL_CRYPTO } from '../constants';
import { AllAverages, Averages, Balances, ExchangeService, OpenOrdersByPairs, Products, Tickers } from '../models';

@Injectable({ providedIn: 'root' })
export class CryptoComService implements ExchangeService {
  private readonly httpClient = inject(HttpClient);

  public getTickers(): Observable<Tickers> {
    return this.httpClient.get<Tickers>(`${API_URL_CRYPTO}/GetTickers`);
  }

  public getCurrencyPairs(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API_URL_CRYPTO}/GetCurrencyPairs`);
  }

  public getBalances(): Observable<Balances> {
    return this.httpClient.get<Balances>(`${API_URL_CRYPTO}/GetBalances`);
  }

  public getAverages(): Observable<AllAverages> {
    return this.httpClient.get<AllAverages>(`${API_URL_CRYPTO}/GetAverages`);
  }

  public getAllOpenOrders(): Observable<OpenOrdersByPairs> {
    return this.httpClient.get<OpenOrdersByPairs>(`${API_URL_CRYPTO}/GetOpenOrders`);
  }

  public getRecentBuyAverages(): Observable<Averages> {
    return this.httpClient.get<Averages>(`${API_URL_CRYPTO}/GetRecentBuyAverages`);
  }

  public getProducts(): Observable<Products> {
    return this.httpClient.get<Products>(`${API_URL_CRYPTO}/GetProducts`);
  }
}
