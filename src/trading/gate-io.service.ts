import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { API_URL_GATE } from '../constants';
import { AllAverages, Averages, Balances, ExchangeService, OpenOrdersByPairs, Products, Tickers } from '../models';

@Injectable({ providedIn: 'root' })
export class GateIoService implements ExchangeService {
  private readonly httpClient = inject(HttpClient);

  public getTickers(): Observable<Tickers> {
    return this.httpClient.get<Tickers>(`${API_URL_GATE}/GetTickers`);
  }

  public getAllOpenOrders(): Observable<OpenOrdersByPairs> {
    return this.httpClient.get<OpenOrdersByPairs>(`${API_URL_GATE}/GetOpenOrders`);
  }

  public getCurrencyPairs(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${API_URL_GATE}/GetCurrencyPairs`);
  }

  public getBalances(): Observable<Balances> {
    return this.httpClient.get<Balances>(`${API_URL_GATE}/GetBalances`);
  }

  public getAverages(): Observable<AllAverages> {
    return this.httpClient.get<AllAverages>(`${API_URL_GATE}/GetAverages`).pipe(
      tap((averages) => {
        const saldo = Object.entries(averages)
          .filter(([key]) => key.endsWith('_BTC'))
          .reduce((res, [, { buy, sell }]) => {
            res += buy.money - sell.money;
            return res;
          }, 0);

        console.log('BTC saldo:', saldo);
      })
    );
  }

  public getRecentBuyAverages(): Observable<Averages> {
    return this.httpClient.get<Averages>(`${API_URL_GATE}/GetRecentBuyAverages`);
  }

  public getProducts(): Observable<Products> {
    return this.httpClient.get<Products>(`${API_URL_GATE}/GetProducts`);
  }
}
