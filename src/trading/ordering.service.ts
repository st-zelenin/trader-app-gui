import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL, API_URL_BINANCE, API_URL_BYBIT, API_URL_CRYPTO, API_URL_GATE, EXCHANGE } from '../constants';
import { NewOrder, Order } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderingService {
  private readonly httpClient = inject(HttpClient);

  public cancel(exchange: EXCHANGE, order: Order): Observable<unknown> {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.post(`${API_URL_GATE}/CancelOrder`, {
          id: order.id,
          pair: order.currencyPair,
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(`${API_URL_CRYPTO}/CancelOrder`, {
          id: order.id,
          pair: order.currencyPair,
        });
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.post(`${API_URL}/coinbase_cancelOrder`, {
          id: order.id,
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.post(`${API_URL_BYBIT}/CancelOrder`, {
          id: order.id,
          pair: order.currencyPair,
        });
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.post(`${API_URL_BINANCE}/CancelOrder`, {
          id: order.id,
          pair: order.currencyPair,
        });
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public create(exchange: EXCHANGE, order: NewOrder): Observable<unknown> {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.post(`${API_URL_GATE}/CreateOrder`, order);
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(`${API_URL_CRYPTO}/CreateOrder`, order);
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.post(`${API_URL}/coinbase_createOrder`, order);
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.post(`${API_URL_BYBIT}/CreateOrder`, order);
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.post(`${API_URL_BINANCE}/CreateOrder`, order);
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public addExternalOrder(exchange: EXCHANGE, order: NewOrder): Observable<unknown> {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.post(`${API_URL_GATE}/AddDexOrder`, order);
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(`${API_URL_CRYPTO}/AddDexOrder`, order);
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.post(`${API_URL}/AddDexOrder`, order);
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.post(`${API_URL_BYBIT}/AddDexOrder`, order);
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.post(`${API_URL_BINANCE}/AddDexOrder`, order);
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }
}
