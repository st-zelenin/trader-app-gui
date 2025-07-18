/* eslint-disable @typescript-eslint/member-ordering */
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { ExchangeActions } from './actions';
import { ExchangeService } from '../../models';
import { BinanceService } from '../../trading/binance.service';
import { BybitService } from '../../trading/bybit.service';
import { CoinbaseService } from '../../trading/coinbase.service';
import { CryptoComService } from '../../trading/crypto-com.service';
import { GateIoService } from '../../trading/gate-io.service';
import { BINANCE_ACTIONS, BYBIT_ACTIONS, COINBASE_ACTIONS, CRYPTO_COM_ACTIONS, GATE_IO_ACTIONS } from '../models';

export class ExchangeEffects {
  constructor(
    private actions: Actions,
    private readonly exchangeService: ExchangeService,
    private readonly exchangeActions: ExchangeActions,
    private readonly snackBar: MatSnackBar
  ) {}

  public readonly getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getTickers),
      mergeMap(() =>
        this.exchangeService.getTickers().pipe(
          map((tickers) => this.exchangeActions.setTickers({ tickers })),
          catchError((err) => {
            this.showError(err, 'failed to get tickers');
            return of(this.exchangeActions.getTickersError());
          })
        )
      )
    )
  );

  public readonly getAnalytics = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllAnalytics),
      mergeMap(() =>
        this.exchangeService.getAverages().pipe(
          map((analytics) => this.exchangeActions.setAllAnalytics({ analytics })),
          catchError((err) => {
            this.showError(err, 'failed to get analytics');
            return of(this.exchangeActions.getAllAnalyticsError());
          })
        )
      )
    )
  );

  public readonly getAllOpenOrders = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllOpenOrders),
      mergeMap(() =>
        this.exchangeService.getAllOpenOrders().pipe(
          map((openOrders) => this.exchangeActions.setAllOpenOrders({ openOrders })),
          catchError((err) => {
            this.showError(err, 'failed to get open orders');
            return of(this.exchangeActions.getAllOpenOrdersError());
          })
        )
      )
    )
  );

  public readonly getBalances = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getBalances),
      mergeMap(() =>
        this.exchangeService.getBalances().pipe(
          map((balances) => this.exchangeActions.setBalances({ balances })),
          catchError((err) => {
            this.showError(err, 'failed to get balances');
            return of(this.exchangeActions.getBalancesError());
          })
        )
      )
    )
  );

  public readonly getCurrencyPairs = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getCurrencyPairs),
      mergeMap(() =>
        this.exchangeService.getCurrencyPairs().pipe(
          map((currencyPairs) => this.exchangeActions.setCurrencyPairs({ currencyPairs })),
          catchError((err) => {
            this.showError(err, 'failed to get currency pairs');
            return of(this.exchangeActions.getCurrencyPairsError());
          })
        )
      )
    )
  );

  public readonly getRecentBuyAverages = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getRecentBuyAverages),
      mergeMap(() =>
        this.exchangeService.getRecentBuyAverages().pipe(
          map((recentBuyAverages) => this.exchangeActions.setRecentBuyAverages({ recentBuyAverages })),
          catchError((err) => {
            this.showError(err, 'failed to get recent buy averages');
            return of(this.exchangeActions.getRecentBuyAveragesError());
          })
        )
      )
    )
  );

  public readonly getProducts = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getProducts),
      mergeMap(() =>
        this.exchangeService.getProducts().pipe(
          map((products) => this.exchangeActions.setProducts({ products })),
          catchError((err) => {
            this.showError(err, 'failed to get products');
            return of(this.exchangeActions.getProductsError());
          })
        )
      )
    )
  );

  private showError(err: any, alternativeText: string): void {
    console.log(err);

    const text = err.error ? JSON.stringify(err.error).substring(0, 300) : alternativeText;

    this.snackBar.open(text, 'x', {
      duration: 60 * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['warning'],
    });
  }
}

@Injectable()
export class BybitEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: BybitService,
    snackBar: MatSnackBar,
    @Inject(BYBIT_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions, snackBar);
  }
}

@Injectable()
export class CoinbaseEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: CoinbaseService,
    snackBar: MatSnackBar,
    @Inject(COINBASE_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions, snackBar);
  }
}

@Injectable()
export class CryptoComEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: CryptoComService,
    snackBar: MatSnackBar,
    @Inject(CRYPTO_COM_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions, snackBar);
  }
}

@Injectable()
export class GateIoEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: GateIoService,
    snackBar: MatSnackBar,
    @Inject(GATE_IO_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions, snackBar);
  }
}

@Injectable()
export class BinanceEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: BinanceService,
    snackBar: MatSnackBar,
    @Inject(BINANCE_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions, snackBar);
  }
}
