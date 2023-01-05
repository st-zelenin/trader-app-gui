import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_BINANCE } from '../constants';
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
export class BinanceService implements ExchangeService {
  constructor(private httpClient: HttpClient) {}

  public getTickers() {
    return this.httpClient.get<Tickers>(`${API_URL_BINANCE}/GetTickers`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<OpenOrdersByPairs>(
      `${API_URL_BINANCE}/GetOpenOrders`
    );
  }

  public getCurrencyPairs() {
    return this.httpClient.get<string[]>(`${API_URL_BINANCE}/GetCurrencyPairs`);
  }

  public getBalances() {
    return this.httpClient.get<Balances>(`${API_URL_BINANCE}/GetBalances`);
  }

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL_BINANCE}/GetAverages`);
  }

  public getRecentBuyAverages() {
    return this.httpClient.get<Averages>(
      `${API_URL_BINANCE}/GetRecentBuyAverages`
    );
  }

  public getProducts() {
    return this.httpClient.get<Products>(`${API_URL_BINANCE}/GetProducts`);
  }
}
