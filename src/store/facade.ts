import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EXCHANGE } from '../constants';
import { Multiplicator, User } from '../models';
import { ExchangeActions, ExchangeSelectors } from './exchange';
import {
  AppState,
  BYBIT_ACTIONS,
  COINBASE_ACTIONS,
  CRYPTO_COM_ACTIONS,
  GATE_IO_ACTIONS,
} from './models';
import { sharedActions, sharedSelectors } from './shared';

@Injectable({
  providedIn: 'root',
})
export class AppStoreFacade {
  private readonly exchangeSelectors = {
    [EXCHANGE.GATE_IO]: new ExchangeSelectors(EXCHANGE.GATE_IO),
    [EXCHANGE.CRYPTO_COM]: new ExchangeSelectors(EXCHANGE.CRYPTO_COM),
    [EXCHANGE.COINBASE]: new ExchangeSelectors(EXCHANGE.COINBASE),
    [EXCHANGE.BYBIT]: new ExchangeSelectors(EXCHANGE.BYBIT),
  };
  private readonly exchangeActions: { [key: string]: ExchangeActions };

  constructor(
    private store: Store<AppState>,
    @Inject(GATE_IO_ACTIONS) gateIoActions: ExchangeActions,
    @Inject(COINBASE_ACTIONS) coinbaseActions: ExchangeActions,
    @Inject(CRYPTO_COM_ACTIONS) cryptoComActions: ExchangeActions,
    @Inject(BYBIT_ACTIONS) bybitActions: ExchangeActions
  ) {
    this.exchangeActions = {
      [EXCHANGE.GATE_IO]: gateIoActions,
      [EXCHANGE.CRYPTO_COM]: cryptoComActions,
      [EXCHANGE.COINBASE]: coinbaseActions,
      [EXCHANGE.BYBIT]: bybitActions,
    };
  }

  public buyMultiplicator = this.store.select(sharedSelectors.buyMultiplicator);
  public orderDefaultTotalAmount = this.store.select(
    sharedSelectors.orderDefaultTotalAmount
  );
  public defaultSellVolumeDivider = this.store.select(
    sharedSelectors.defaultSellVolumeDivider
  );
  public defaultSellPriceMultiplicator = this.store.select(
    sharedSelectors.defaultSellPriceMultiplicator
  );
  public pairs = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].pairs);
  public tickers = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].tickers);
  public ticker = (exchange: EXCHANGE, id: string) =>
    this.store.select(this.exchangeSelectors[exchange].ticker(id));
  public analytics = (exchange: EXCHANGE, id: string) =>
    this.store.select(this.exchangeSelectors[exchange].analytics(id));
  public openOrders = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].openOrders);
  public pairOpenOrders = (exchange: EXCHANGE, currencyPair: string) =>
    this.store.select(
      this.exchangeSelectors[exchange].pairOpenOrders(currencyPair)
    );
  public pairRecentBuyAverages = (exchange: EXCHANGE, currencyPair: string) =>
    this.store.select(
      this.exchangeSelectors[exchange].pairRecentBuyAverages(currencyPair)
    );
  public currencyPairs = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].currencyPairs);
  public balance = (exchange: EXCHANGE, currency: string) =>
    this.store.select(
      this.exchangeSelectors[exchange].currencyBalance(currency)
    );
  public balances = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].balances);

  public products = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].products);
  public product = (exchange: EXCHANGE, currency: string) =>
    this.store.select(this.exchangeSelectors[exchange].product(currency));

  public getTickers(exchange: EXCHANGE) {
    return this.store.dispatch(this.exchangeActions[exchange].getTickers());
  }

  public getAnalytics(exchange: EXCHANGE) {
    return this.store.dispatch(
      this.exchangeActions[exchange].getAllAnalytics()
    );
  }

  public getRecentBuyAverages(exchange: EXCHANGE) {
    return this.store.dispatch(
      this.exchangeActions[exchange].getRecentBuyAverages()
    );
  }

  public getOpenOrders(exchange: EXCHANGE) {
    return this.store.dispatch(
      this.exchangeActions[exchange].getAllOpenOrders()
    );
  }

  public getBalances(exchange: EXCHANGE) {
    return this.store.dispatch(this.exchangeActions[exchange].getBalances());
  }

  public getCurrencyPairs(exchange: EXCHANGE) {
    return this.store.dispatch(
      this.exchangeActions[exchange].getCurrencyPairs()
    );
  }

  public getProducts(exchange: EXCHANGE) {
    return this.store.dispatch(this.exchangeActions[exchange].getProducts());
  }

  public setPairs(user: User) {
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.GATE_IO].setPairs({ pairs: user.pairs })
    );
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.CRYPTO_COM].setPairs({
        pairs: user.crypto_pairs,
      })
    );
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.COINBASE].setPairs({
        pairs: user.coinbase_pairs,
      })
    );
    this.store.dispatch(
      this.exchangeActions[EXCHANGE.BYBIT].setPairs({ pairs: user.bybit_pairs })
    );
  }

  public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
    this.store.dispatch(
      sharedActions.setBuyMultiplicator({ buyMultiplicator })
    );
  }

  public setOrderDefaultTotalAmount(total: number) {
    this.store.dispatch(sharedActions.setOrderDefaultTotalAmount({ total }));
  }

  public setDefaultSellVolumeDivider(divider: number) {
    this.store.dispatch(sharedActions.setDefaultSellVolumeDivider({ divider }));
  }

  public setDefaultSellPriceMultiplicator(multiplicator: number) {
    this.store.dispatch(
      sharedActions.setDefaultSellPriceMultiplicator({ multiplicator })
    );
  }
}
