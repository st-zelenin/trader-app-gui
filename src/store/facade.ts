import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EXCHANGE } from '../constants';
import { Multiplicator, User } from '../models';
import { actions as coinbaseActions } from './coinbase';
import { actions as cryptoComActions } from './crypto-com';
import { ExchangeSelectors } from './exchange-selectors';
import { actions as gateIoActions } from './gate-io';
import * as sharedActions from './shared/actions';
import * as sharedSelectors from './shared/selectors';
import { AppState, ExchangeActions } from './state';

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
  private readonly exchangeActions: { [key: string]: ExchangeActions } = {
    [EXCHANGE.GATE_IO]: gateIoActions,
    [EXCHANGE.CRYPTO_COM]: cryptoComActions,
    [EXCHANGE.COINBASE]: coinbaseActions,
  };

  constructor(private store: Store<AppState>) {}

  public buyMultiplicator = this.store.select(sharedSelectors.buyMultiplicator);
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
  public currencyPairs = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].currencyPairs);
  public balance = (exchange: EXCHANGE, currency: string) =>
    this.store.select(
      this.exchangeSelectors[exchange].currencyBalance(currency)
    );
  public balances = (exchange: EXCHANGE) =>
    this.store.select(this.exchangeSelectors[exchange].balances);

  public getTickers(exchange: EXCHANGE) {
    return this.store.dispatch(this.exchangeActions[exchange].getTickers());
  }

  public getAnalytics(exchange: EXCHANGE) {
    return this.store.dispatch(
      this.exchangeActions[exchange].getAllAnalytics()
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

  public setPairs(user: User) {
    this.store.dispatch(gateIoActions.setPairs({ pairs: user.pairs }));
    this.store.dispatch(
      cryptoComActions.setPairs({ pairs: user.crypto_pairs })
    );
    this.store.dispatch(
      coinbaseActions.setPairs({ pairs: user.coinbase_pairs })
    );
  }

  public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
    this.store.dispatch(
      sharedActions.setBuyMultiplicator({ buyMultiplicator })
    );
  }
}
