import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HistoryService } from '../history.service';
import {
  getAllAnalytics,
  getAllAnalyticsError,
  getAllOpenOrders,
  getAllOpenOrdersError,
  getAllTickers,
  getAllTickersError,
  getBalances,
  getBalancesError,
  setAllAnalytics,
  setAllOpenOrders,
  setAllTickers,
  setBalances,
} from './actions';

@Injectable()
export class Effects {
  constructor(
    private actions: Actions,
    private store: Store,
    private readonly historyService: HistoryService
  ) {}

  getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(getAllTickers),
      mergeMap(() => this.historyService.getAllTickers()),
      map((tickers) => setAllTickers({ tickers })),
      catchError((err) => {
        console.log(err);
        return of(getAllTickersError());
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
