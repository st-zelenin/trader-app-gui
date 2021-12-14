import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CryptoComService } from '../../trading/crypto-com/crypto-com.service';
import {
  getAllAnalytics,
  getAllAnalyticsError,
  getAllOpenOrders,
  getAllOpenOrdersError,
  getBalances,
  getBalancesError,
  getickers,
  getTickersError,
  setAllAnalytics,
  setAllOpenOrders,
  setBalances,
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
      ofType(getickers),
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
}
