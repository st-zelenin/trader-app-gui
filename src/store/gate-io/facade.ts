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
  getAllTickers,
  getBalances,
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
export class GateIoFacade implements ExchangeStateFacade {
  public ticker = (id: string) => this.store.select<Ticker>(ticker(id));
  public analytics = (id: string) =>
    this.store.select<PairAverages>(analytics(id));
  public pairOpenOrders = (currencyPair: string) =>
    this.store.select<Order[]>(pairOpenOrders(currencyPair));
  public balance = (currency: string) =>
    this.store.select<Balance>(currencyBalance(currency));

  constructor(private store: Store<AppState>) {}

  public getTickers() {
    this.store.dispatch(getAllTickers());
  }

  public getAnalytics() {
    this.store.dispatch(getAllAnalytics());
  }

  public getOpenOrders() {
    this.store.dispatch(getAllOpenOrders());
  }

  public getBalances() {
    this.store.dispatch(getBalances());
  }
}
