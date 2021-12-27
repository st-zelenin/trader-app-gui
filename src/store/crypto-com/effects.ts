import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CryptoComService } from '../../trading/crypto-com.service';
import {
  getAllAnalytics,
  getAllAnalyticsError,
  getAllOpenOrders,
  getAllOpenOrdersError,
  getBalances,
  getBalancesError,
  getCurrencyPairs,
  getCurrencyPairsError,
  getTickers,
  getTickersError,
  setAllAnalytics,
  setAllOpenOrders,
  setBalances,
  setCurrencyPairs,
  setTickers,
} from './actions';

@Injectable()
export class CryptoComEffects {
  constructor(
    private actions: Actions,
    private store: Store,
    private readonly historyService: CryptoComService
  ) {}

  getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(getTickers),
      mergeMap(() => this.historyService.getTickers()),
      map((tickers) => setTickers({ tickers })),
      catchError((err) => {
        console.log(err);
        return of(getTickersError());
      })
    )
  );

  getAnalytics = createEffect(() =>
    this.actions.pipe(
      ofType(getAllAnalytics),
      mergeMap(() => this.historyService.getAverages()),
      map((analytics) => setAllAnalytics({ analytics })),
      catchError((err) => {
        console.log(err);
        return of(getAllAnalyticsError());
      })
    )
  );

  getAllOpenOrders = createEffect(() =>
    this.actions.pipe(
      ofType(getAllOpenOrders),
      mergeMap(() => this.historyService.getAllOpenOrders()),
      map((openOrders) => setAllOpenOrders({ openOrders })),
      catchError((err) => {
        console.log(err);
        return of(getAllOpenOrdersError());
      })
    )
  );

  getBalances = createEffect(() =>
    this.actions.pipe(
      ofType(getBalances),
      mergeMap(() => this.historyService.getBalances()),
      map((balances) => setBalances({ balances })),
      catchError((err) => {
        console.log(err);
        return of(getBalancesError());
      })
    )
  );

  getCurrencyPairs = createEffect(() =>
    this.actions.pipe(
      ofType(getCurrencyPairs),
      mergeMap(() => this.historyService.getCurrencyPairs()),
      map((currencyPairs) => setCurrencyPairs({ currencyPairs })),
      catchError((err) => {
        console.log(err);
        return of(getCurrencyPairsError());
      })
    )
  );
}
