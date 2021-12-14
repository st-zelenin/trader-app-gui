import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Balance,
  ExchangeStateFacade,
  Order,
  PairAverages,
  Ticker,
} from '../../models';
import { AppState } from '../state';
import {
  getAllAnalytics,
  getAllOpenOrders,
  getBalances,
  getickers,
} from './actions';
import {
  analytics,
  currencyBalance,
  pairOpenOrders,
  ticker,
} from './selectors';

@Injectable({
  providedIn: 'root',
})
export class CryptoComFacade implements ExchangeStateFacade {
  public ticker = (id: string) => this.store.select<Ticker>(ticker(id));
  public analytics = (id: string) =>
    this.store.select<PairAverages>(analytics(id));
  public pairOpenOrders = (currencyPair: string) =>
    this.store.select<Order[]>(pairOpenOrders(currencyPair));
  public balance = (currency: string) =>
    this.store.select<Balance>(currencyBalance(currency));

  constructor(private store: Store<AppState>) {}

  getTickers(): void {
    this.store.dispatch(getickers());
  }
  getAnalytics(): void {
    this.store.dispatch(getAllAnalytics());
  }
  getOpenOrders(): void {
    throw new Error('Method not implemented.');
  }

  // public getSingleAnalytics() {
  //   this.store.dispatch(getAllAnalytics());
  // }

  public getAllOpenOrders() {
    this.store.dispatch(getAllOpenOrders());
  }

  public getBalances() {
    this.store.dispatch(getBalances());
  }

  // public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
  //   this.store.dispatch(setBuyMultiplicator({ buyMultiplicator }));
  // }
}
