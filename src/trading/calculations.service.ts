import { Injectable } from '@angular/core';
import { EXCHANGE } from '../constants';
import { Balance, Ticker } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CalculationsService {
  public calcEstimatedTotal(ticker?: Ticker, balance?: Balance) {
    return ticker && balance
      ? ticker.last * (balance.available + balance.locked)
      : 0;
  }

  // TODO: move to another service or rename this one
  public getCurrencyPair(baseCurrency: string, exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
      case EXCHANGE.CRYPTO_COM:
        return `${baseCurrency}_USDT`;
      case EXCHANGE.COINBASE:
        return `${baseCurrency}-EUR`;
      case EXCHANGE.BYBIT:
        return `${baseCurrency}USDT`;
      default:
        throw new Error(`unhandled get currency pair for ${exchange}`);
    }
  }

  // TODO: move to another service or rename this one
  public buildTradingViewSymbol(currencyPair: string, exchange: EXCHANGE) {
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        const [currency, base] = currencyPair.split('_');
        if (base === 'BTC') {
          return `BINANCE:${currency}${base}`;
        }

        return `GATEIO:${currency}${base}`;
      case EXCHANGE.CRYPTO_COM:
        // since there is no Crypto.com in TV, Gate.io is used
        return `GATEIO:${currencyPair.replace('_', '')}`;
      case EXCHANGE.COINBASE:
        return `COINBASE:${currencyPair.replace('-', '')}`;
      case EXCHANGE.BYBIT:
        return `BYBIT:${currencyPair}`;
      default:
        throw new Error(`unhandled exchange: ${exchange}`);
    }
  }

  public getBaseCurrency(currencyPair: string, exchange: EXCHANGE) {
    // TODO: remove this dirty hack
    return exchange === EXCHANGE.BYBIT
      ? currencyPair.replace('USDT', '')
      : currencyPair.split(/_|-/)[0];
  }
}
