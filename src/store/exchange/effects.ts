import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BinanceService } from '../../trading/binance.service';
import { ExchangeService } from '../../models';
import { BybitService } from '../../trading/bybit.service';
import { CoinbaseService } from '../../trading/coinbase.service';
import { CryptoComService } from '../../trading/crypto-com.service';
import { GateIoService } from '../../trading/gate-io.service';
import {
  BINANCE_ACTIONS,
  BYBIT_ACTIONS,
  COINBASE_ACTIONS,
  CRYPTO_COM_ACTIONS,
  GATE_IO_ACTIONS,
} from '../models';
import { ExchangeActions } from './actions';
import { MatSnackBar } from '@angular/material/snack-bar';

export class ExchangeEffects {
  constructor(
    private actions: Actions,
    private readonly exchangeService: ExchangeService,
    private readonly exchangeActions: ExchangeActions,
    private readonly snackBar: MatSnackBar
  ) {}

  getTickers = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getTickers),
      mergeMap(() =>
        this.exchangeService.getTickers().pipe(
          map((tickers) => this.exchangeActions.setTickers({ tickers })),
          catchError((err) => {
            this.showError('failed to get tickers');
            console.log(err);
            return of(this.exchangeActions.getTickersError());
          })
        )
      )
    )
  );

  getAnalytics = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllAnalytics),
      mergeMap(() =>
        this.exchangeService.getAverages().pipe(
          map((analytics) =>
            this.exchangeActions.setAllAnalytics({ analytics })
          ),
          catchError((err) => {
            this.showError('failed to get analytics');
            console.log(err);
            return of(this.exchangeActions.getAllAnalyticsError());
          })
        )
      )
    )
  );

  getAllOpenOrders = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getAllOpenOrders),
      mergeMap(() =>
        this.exchangeService.getAllOpenOrders().pipe(
          map((openOrders) =>
            this.exchangeActions.setAllOpenOrders({ openOrders })
          ),
          catchError((err) => {
            this.showError('failed to get open orders');
            console.log(err);
            return of(this.exchangeActions.getAllOpenOrdersError());
          })
        )
      )
    )
  );

  getBalances = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getBalances),
      mergeMap(() =>
        this.exchangeService.getBalances().pipe(
          map((balances) => this.exchangeActions.setBalances({ balances })),
          catchError((err) => {
            this.showError('failed to get balances');
            console.log(err);
            return of(this.exchangeActions.getBalancesError());
          })
        )
      )
    )
  );

  getCurrencyPairs = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getCurrencyPairs),
      mergeMap(() =>
        this.exchangeService.getCurrencyPairs().pipe(
          map((currencyPairs) =>
            this.exchangeActions.setCurrencyPairs({ currencyPairs })
          ),
          catchError((err) => {
            this.showError('failed to get currency pairs');
            console.log(err);
            return of(this.exchangeActions.getCurrencyPairsError());
          })
        )
      )
    )
  );

  getRecentBuyAverages = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getRecentBuyAverages),
      mergeMap(() =>
        this.exchangeService.getRecentBuyAverages().pipe(
          map((recentBuyAverages) =>
            this.exchangeActions.setRecentBuyAverages({ recentBuyAverages })
          ),
          catchError((err) => {
            this.showError('failed to get recent buy averages');
            console.log(err);
            return of(this.exchangeActions.getRecentBuyAveragesError());
          })
        )
      )
    )
  );

  getProducts = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getProducts),
      mergeMap(() =>
        this.exchangeService.getProducts().pipe(
          map((products) => this.exchangeActions.setProducts({ products })),
          catchError((err) => {
            this.showError('failed to get products');
            console.log(err);
            return of(this.exchangeActions.getProductsError());
          })
        )
      )
    )
  );

  private showError(text: string) {
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
