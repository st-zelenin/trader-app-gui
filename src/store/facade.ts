/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ExchangeActions, ExchangeSelectors } from './exchange';
import { AppState, BINANCE_ACTIONS, BYBIT_ACTIONS, COINBASE_ACTIONS, CRYPTO_COM_ACTIONS, GATE_IO_ACTIONS } from './models';
import { sharedActions, sharedSelectors } from './shared';
import { EXCHANGE } from '../constants';
import {
  Average,
  Balance,
  Balances,
  CryptoPair,
  Multiplicator,
  OpenOrdersByPairs,
  Order,
  PairAverages,
  Product,
  Products,
  Ticker,
  Tickers,
  User,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AppStoreFacade {
  private readonly exchangeSelectors = {
    [EXCHANGE.GATE_IO]: new ExchangeSelectors(EXCHANGE.GATE_IO),
    [EXCHANGE.CRYPTO_COM]: new ExchangeSelectors(EXCHANGE.CRYPTO_COM),
    [EXCHANGE.COINBASE]: new ExchangeSelectors(EXCHANGE.COINBASE),
    [EXCHANGE.BYBIT]: new ExchangeSelectors(EXCHANGE.BYBIT),
    [EXCHANGE.BINANCE]: new ExchangeSelectors(EXCHANGE.BINANCE),
  };
  private readonly exchangeActions: { [key: string]: ExchangeActions };

  private readonly gateIoActions: ExchangeActions = inject(GATE_IO_ACTIONS);
  private readonly coinbaseActions: ExchangeActions = inject(COINBASE_ACTIONS);
  private readonly cryptoComActions: ExchangeActions = inject(CRYPTO_COM_ACTIONS);
  private readonly bybitActions: ExchangeActions = inject(BYBIT_ACTIONS);
  private readonly binanceActions: ExchangeActions = inject(BINANCE_ACTIONS);

  constructor(private store: Store<AppState>) {
    this.exchangeActions = {
      [EXCHANGE.GATE_IO]: this.gateIoActions,
      [EXCHANGE.CRYPTO_COM]: this.cryptoComActions,
      [EXCHANGE.COINBASE]: this.coinbaseActions,
      [EXCHANGE.BYBIT]: this.bybitActions,
      [EXCHANGE.BINANCE]: this.binanceActions,
    };
  }

  public readonly buyMultiplicator = this.store.select(sharedSelectors.buyMultiplicator);
  public readonly orderDefaultTotalAmount = this.store.select(sharedSelectors.orderDefaultTotalAmount);
  public readonly defaultSellVolumeDivider = this.store.select(sharedSelectors.defaultSellVolumeDivider);
  public readonly defaultSellPriceMultiplicator = this.store.select(sharedSelectors.defaultSellPriceMultiplicator);
  public readonly pairs = (exchange: EXCHANGE): Observable<CryptoPair[]> => this.store.select(this.exchangeSelectors[exchange].pairs);
  public readonly tickers = (exchange: EXCHANGE): Observable<Tickers> => this.store.select(this.exchangeSelectors[exchange].tickers);
  public readonly ticker = (exchange: EXCHANGE, id: string): Observable<Ticker> =>
    this.store.select(this.exchangeSelectors[exchange].ticker(id));
  public readonly analytics = (exchange: EXCHANGE, id: string): Observable<PairAverages> =>
    this.store.select(this.exchangeSelectors[exchange].analytics(id));
  public readonly openOrders = (exchange: EXCHANGE): Observable<OpenOrdersByPairs> =>
    this.store.select(this.exchangeSelectors[exchange].openOrders);
  public readonly pairOpenOrders = (exchange: EXCHANGE, currencyPair: string): Observable<Order[]> =>
    this.store.select(this.exchangeSelectors[exchange].pairOpenOrders(currencyPair));
  public readonly pairRecentBuyAverages = (exchange: EXCHANGE, currencyPair: string): Observable<Average> =>
    this.store.select(this.exchangeSelectors[exchange].pairRecentBuyAverages(currencyPair));
  public readonly currencyPairs = (exchange: EXCHANGE): Observable<string[]> =>
    this.store.select(this.exchangeSelectors[exchange].currencyPairs);
  public readonly balance = (exchange: EXCHANGE, currency: string): Observable<Balance> =>
    this.store.select(this.exchangeSelectors[exchange].currencyBalance(currency));
  public readonly balances = (exchange: EXCHANGE): Observable<Balances> => this.store.select(this.exchangeSelectors[exchange].balances);

  public readonly products = (exchange: EXCHANGE): Observable<Products | undefined> =>
    this.store.select(this.exchangeSelectors[exchange].products);
  public readonly product = (exchange: EXCHANGE, currency: string): Observable<Product | null> =>
    this.store.select(this.exchangeSelectors[exchange].product(currency));

  public getTickers(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getTickers());
  }

  public getAnalytics(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getAllAnalytics());
  }

  public getRecentBuyAverages(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getRecentBuyAverages());
  }

  public getOpenOrders(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getAllOpenOrders());
  }

  public getBalances(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getBalances());
  }

  public getCurrencyPairs(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getCurrencyPairs());
  }

  public getProducts(exchange: EXCHANGE): void {
    return this.store.dispatch(this.exchangeActions[exchange].getProducts());
  }

  public setPairs(user: User): void {
    this.store.dispatch(this.exchangeActions[EXCHANGE.GATE_IO].setPairs({ pairs: user.gate }));
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.CRYPTO_COM].setPairs({
        pairs: user.crypto,
      })
    );
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.COINBASE].setPairs({
        pairs: user.coinbase,
      })
    );
    this.store.dispatch(this.exchangeActions[EXCHANGE.BYBIT].setPairs({ pairs: user.bybit }));
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.BINANCE].setPairs({
        pairs: user.binance,
      })
    );
  }

  public setBuyMultiplicator(buyMultiplicator: Multiplicator): void {
    this.store.dispatch(sharedActions.setBuyMultiplicator({ buyMultiplicator }));
  }

  public setOrderDefaultTotalAmount(total: number): void {
    this.store.dispatch(sharedActions.setOrderDefaultTotalAmount({ total }));
  }

  public setDefaultSellVolumeDivider(divider: number): void {
    this.store.dispatch(sharedActions.setDefaultSellVolumeDivider({ divider }));
  }

  public setDefaultSellPriceMultiplicator(multiplicator: number): void {
    this.store.dispatch(sharedActions.setDefaultSellPriceMultiplicator({ multiplicator }));
  }
}
