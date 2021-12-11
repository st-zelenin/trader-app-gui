import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  Balance,
  ExchangeStateFacade,
  Order,
  PairAverages,
  Ticker,
} from '../../models';
import { AppState } from '../state';
import { getBalances, getickers } from './actions';
import { currencyBalance, ticker } from './selectors';

@Injectable({
  providedIn: 'root',
})
export class CryptoComFacade implements ExchangeStateFacade {
  public ticker = (id: string) => this.store.select<Ticker>(ticker(id));
  analytics: (id: string) => Observable<PairAverages> = () =>
    of(undefined as any);
  pairOpenOrders: (currencyPair: string) => Observable<Order[]> = () =>
    of(undefined as any);

  // public analytics = (id: string) =>
  //   this.store.select<PairAverages>(analytics(id));
  // public pairOpenOrders = (currencyPair: string) =>
  //   this.store.select<Order[]>(pairOpenOrders(currencyPair));
  public balance = (currency: string) =>
    this.store.select<Balance>(currencyBalance(currency));

  constructor(private store: Store<AppState>) {}

  getTickers(): void {
    throw new Error('Method not implemented.');
  }
  getAnalytics(): void {
    throw new Error('Method not implemented.');
  }
  getOpenOrders(): void {
    throw new Error('Method not implemented.');
  }

  public getAllTickers() {
    this.store.dispatch(getickers());
  }

  // public getAllAnalytics() {
  //   this.store.dispatch(getAllAnalytics());
  // }

  // public getSingleAnalytics() {
  //   this.store.dispatch(getAllAnalytics());
  // }

  // public getAllOpenOrders() {
  //   this.store.dispatch(getAllOpenOrders());
  // }

  public getBalances() {
    this.store.dispatch(getBalances());
  }

  // public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
  //   this.store.dispatch(setBuyMultiplicator({ buyMultiplicator }));
  // }
}
