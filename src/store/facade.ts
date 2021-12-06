import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Balance,
  Multiplicator,
  Order,
  PairAverages,
  TickerInfo,
} from '../models';
import {
  getAllAnalytics,
  getAllOpenOrders,
  getAllTickers,
  getBalances,
  setBuyMultiplicator,
} from './actions';
import {
  analytics,
  buyMultiplicator,
  currencyBalance,
  pairOpenOrders,
  ticker,
} from './selectors';
import { AppState } from './state';

@Injectable({
  providedIn: 'root',
})
export class Facade {
  public ticker = (id: string) => this.store.select<TickerInfo>(ticker(id));
  public analytics = (id: string) =>
    this.store.select<PairAverages>(analytics(id));
  public pairOpenOrders = (currencyPair: string) =>
    this.store.select<Order[]>(pairOpenOrders(currencyPair));
  public balance = (currency: string) =>
    this.store.select<Balance>(currencyBalance(currency));
  public buyMultiplicator = this.store.select<Multiplicator>(buyMultiplicator);

  constructor(private store: Store<AppState>) {}

  public getAllTickers() {
    this.store.dispatch(getAllTickers());
  }

  public getAllAnalytics() {
    this.store.dispatch(getAllAnalytics());
  }

  public getSingleAnalytics() {
    this.store.dispatch(getAllAnalytics());
  }

  public getAllOpenOrders() {
    this.store.dispatch(getAllOpenOrders());
  }

  public getBalances() {
    this.store.dispatch(getBalances());
  }

  public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
    this.store.dispatch(setBuyMultiplicator({ buyMultiplicator }));
  }
}
