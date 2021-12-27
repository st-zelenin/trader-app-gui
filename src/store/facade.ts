import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EXCHANGE } from '../constants';
import { Multiplicator, User } from '../models';
import * as coinbaseActions from './coinbase/actions';
import * as coinbaseSelectors from './coinbase/selectors';
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

  public pairs = (exchange: EXCHANGE) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.pairs);
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.pairs);
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.pairs);
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public tickers = (exchange: EXCHANGE) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.tickers);
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.tickers);
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.tickers);
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public ticker = (exchange: EXCHANGE, id: string) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.ticker(id));
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.ticker(id));
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.ticker(id));
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
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.analytics(id));
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public openOrders = (exchange: EXCHANGE) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.openOrders);
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.openOrders);
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.openOrders);
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
      case EXCHANGE.COINBASE:
        return this.store.select(
          coinbaseSelectors.pairOpenOrders(currencyPair)
        );
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public currencyPairs = (exchange: EXCHANGE) => {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.select(gateIoSelectors.currencyPairs);
      case EXCHANGE.CRYPTO_COM:
        return this.store.select(cryptoComSelectors.currencyPairs);
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.currencyPairs);
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
      case EXCHANGE.COINBASE:
        return this.store.select(coinbaseSelectors.currencyBalance(currency));
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  };

  public getTickers(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getTickers());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.getTickers());
      case EXCHANGE.COINBASE:
        return this.store.dispatch(coinbaseActions.getTickers());
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
      case EXCHANGE.COINBASE:
        return this.store.dispatch(coinbaseActions.getAllAnalytics());
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
      case EXCHANGE.COINBASE:
        return this.store.dispatch(coinbaseActions.getAllOpenOrders());
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
      case EXCHANGE.COINBASE:
        return this.store.dispatch(coinbaseActions.getBalances());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public getCurrencyPairs(exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        return this.store.dispatch(gateIoActions.getCurrencyPairs());
      case EXCHANGE.CRYPTO_COM:
        return this.store.dispatch(cryptoComActions.getCurrencyPairs());
      case EXCHANGE.COINBASE:
        return this.store.dispatch(coinbaseActions.getCurrencyPairs());
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
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
