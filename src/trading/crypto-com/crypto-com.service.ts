import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants';
import { AllAverages, Balances, PairOpenOrders, Tickers } from '../../models';

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

  public getAverages() {
    return this.httpClient.get<AllAverages>(`${API_URL}/crypto_getAverages`);
  }

  public getAllOpenOrders() {
    return this.httpClient.get<PairOpenOrders>(
      `${API_URL}/crypto_getOpenOrders`
    );
  }

  public importYearHistory() {
    return this.httpClient.post<Balances>(
      `${API_URL}/orchestrators/crypto_importHistory_orchestrator`,
      { periodMonths: 12 }
    );
  }
}
