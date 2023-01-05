import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_URL,
  API_URL_BINANCE,
  API_URL_BYBIT,
  API_URL_CRYPTO,
  API_URL_GATE,
  EXCHANGE,
} from '../constants';
import { NewOrder, Order } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderingService {
  constructor(private httpClient: HttpClient) {}

  public cancel(exchange: EXCHANGE, order: Order) {
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
        });
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.post(`${API_URL_BINANCE}/CancelOrder`, {
          id: order.id,
        });
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public create(exchange: EXCHANGE, order: NewOrder) {
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
}
