import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ExchangeService } from '../models';
import { ExchangeActions } from './state';

export class ExchangeEffects {
  constructor(
    private actions: Actions,
    private readonly exchangeService: ExchangeService,
    private readonly exchangeActions: ExchangeActions
  ) {}

  getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getTickers),
      mergeMap(() => this.exchangeService.getTickers()),
      map((tickers) => this.exchangeActions.setTickers({ tickers })),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getTickersError());
      })
    )
  );

  getAnalytics = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllAnalytics),
      mergeMap(() => this.exchangeService.getAverages()),
      map((analytics) => this.exchangeActions.setAllAnalytics({ analytics })),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getAllAnalyticsError());
      })
    )
  );

  getAllOpenOrders = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllOpenOrders),
      mergeMap(() => this.exchangeService.getAllOpenOrders()),
      map((openOrders) =>
        this.exchangeActions.setAllOpenOrders({ openOrders })
      ),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getAllOpenOrdersError());
      })
    )
  );

  getBalances = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getBalances),
      mergeMap(() => this.exchangeService.getBalances()),
      map((balances) => this.exchangeActions.setBalances({ balances })),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getBalancesError());
      })
    )
  );

  getCurrencyPairs = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getCurrencyPairs),
      mergeMap(() => this.exchangeService.getCurrencyPairs()),
      map((currencyPairs) =>
        this.exchangeActions.setCurrencyPairs({ currencyPairs })
      ),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getCurrencyPairsError());
      })
    )
  );
}
