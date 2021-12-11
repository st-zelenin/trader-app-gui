import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants';
import { Balances, Tickers } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CryptoComService {
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
}
