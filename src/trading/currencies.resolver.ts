import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CurrencyPair } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesResolver implements Resolve<CurrencyPair> {
  constructor(private readonly httpClient: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CurrencyPair> {
    return this.httpClient.get<CurrencyPair>(
      'http://localhost:7071/api/getCurrencyPairs'
    );
  }
}
