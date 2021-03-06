import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL, EXCHANGE } from '../constants';
import { NewOrder, Order } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderingService {
  constructor(private httpClient: HttpClient) {}

  public cancel(exchange: EXCHANGE, order: Order) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.delete(`${API_URL}/cancelOrder`, {
          params: { id: order.id, pair: order.currencyPair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(`${API_URL}/crypto_cancelOrder`, {
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
        return this.httpClient.post(`${API_URL}/bybit_cancelOrder`, {
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
        return this.httpClient.post(`${API_URL}/createOrder`, {
          order,
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(`${API_URL}/crypto_createOrder`, order);
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.post(`${API_URL}/coinbase_createOrder`, order);
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.post(`${API_URL}/bybit_createOrder`, order);
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }
}
