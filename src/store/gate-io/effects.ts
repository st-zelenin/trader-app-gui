import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GateIoService } from '../../trading/gate-io/gate-io.service';
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
export class GateIoEffects {
  constructor(
    private actions: Actions,
    private store: Store,
    private readonly gateIoService: GateIoService
  ) {}

  getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(getAllTickers),
      mergeMap(() => this.gateIoService.getAllTickers()),
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
      mergeMap(() => this.gateIoService.getAverages()),
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
      mergeMap(() => this.gateIoService.getAllOpenOrders()),
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
      mergeMap(() => this.gateIoService.getBalances()),
      map((balances) => setBalances({ balances })),
      catchError((err) => {
        console.log(err);
        return of(getBalancesError());
      })
    )
  );
}
