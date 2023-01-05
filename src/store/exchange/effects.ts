import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { BinanceService } from 'src/trading/binance.service';
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

  getRecentBuyAverages = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getRecentBuyAverages),
      mergeMap(() => this.exchangeService.getRecentBuyAverages()),
      map((recentBuyAverages) =>
        this.exchangeActions.setRecentBuyAverages({ recentBuyAverages })
      ),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getRecentBuyAveragesError());
      })
    )
  );

  getProducts = createEffect(() =>
    this.actions.pipe(
      ofType(this.exchangeActions.getProducts),
      mergeMap(() => this.exchangeService.getProducts()),
      map((products) => this.exchangeActions.setProducts({ products })),
      catchError((err) => {
        console.log(err);
        return of(this.exchangeActions.getProductsError());
      })
    )
  );
}

@Injectable()
export class BybitEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: BybitService,
    @Inject(BYBIT_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions);
  }
}

@Injectable()
export class CoinbaseEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: CoinbaseService,
    @Inject(COINBASE_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions);
  }
}

@Injectable()
export class CryptoComEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: CryptoComService,
    @Inject(CRYPTO_COM_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions);
  }
}

@Injectable()
export class GateIoEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: GateIoService,
    @Inject(GATE_IO_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions);
  }
}

@Injectable()
export class BinanceEffects extends ExchangeEffects {
  constructor(
    actions: Actions,
    exchangeService: BinanceService,
    @Inject(BINANCE_ACTIONS) exchangeActions: ExchangeActions
  ) {
    super(actions, exchangeService, exchangeActions);
  }
}
