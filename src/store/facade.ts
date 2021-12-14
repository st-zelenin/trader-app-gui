import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EXCHANGE } from '../constants';
import { Multiplicator } from '../models';
import * as cryptoComActions from './crypto-com/actions';
import * as cryptoComSelectors from './crypto-com/selectors';
import * as gateIoActions from './gate-io/actions';
import * as gateIoSelectors from './gate-io/selectors';
import * as sharedActions from './shared/actions';
import * as sharedSelectors from './shared/selectors';
import { AppState } from './state';

@Injectable({
  providedIn: 'root',
})
export class AppStoreFacade {
  constructor(private store: Store<AppState>) {}

  public buyMultiplicator = this.store.select(sharedSelectors.buyMultiplicator);

  public ticker = (exchange: EXCHANGE, id: string) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.ticker(id));
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.ticker(id));
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public analytics = (exchange: EXCHANGE, id: string) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.analytics(id));
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.analytics(id));
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public pairOpenOrders = (exchange: EXCHANGE, currencyPair: string) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.pairOpenOrders(currencyPair));
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(
          cryptoComSelectors.pairOpenOrders(currencyPair)
        );
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public balance = (exchange: EXCHANGE, currency: string) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.currencyBalance(currency));
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.currencyBalance(currency));
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public getTickers(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getAllTickers());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.geTickers());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public getAnalytics(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getAllAnalytics());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.getAllAnalytics());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public getOpenOrders(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getAllOpenOrders());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.getAllOpenOrders());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public getBalances(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getBalances());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.getBalances());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
    this.store.dispatch(
      sharedActions.setBuyMultiplicator({ buyMultiplicator })
    );
  }
}
