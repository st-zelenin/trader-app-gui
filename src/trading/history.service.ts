import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL, EXCHANGE } from '../constants';
import { Order, OrderSide } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private httpClient: HttpClient) {}

  public importAll(exchange: EXCHANGE, pair: string) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.get(`${API_URL}/importAllHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(
          `${API_URL}/orchestrators/crypto_importHistory_orchestrator`,
          { periodMonths: 12 }
        );
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get(`${API_URL}/coinbase_importHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get(`${API_URL}/bybit_importHistory`, {
          params: { pair },
        });
      }
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }
  }

  public updateRecent(exchange: EXCHANGE, pair: string) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.get(`${API_URL}/updateRecentHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get(`${API_URL}/crypto_updateTradeHistory`);
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get(`${API_URL}/coinbase_updateTradeHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get(`${API_URL}/bybit_updateTradeHistory`, {
          params: { pair },
        });
      }
      default:
        throw new Error(`unhandled exchange type: ${exchange}`);
    }
  }

  public getHistory(exchange: EXCHANGE, pair: string) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient
          .get<{ total: number; res: Order[] }>(`${API_URL}/getHistory`, {
            params: { pair },
          })
          .pipe(map(({ res }) => res));
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get<Order[]>(`${API_URL}/crypto_getHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get<Order[]>(`${API_URL}/coinbase_getHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get<Order[]>(`${API_URL}/bybit_getHistory`, {
          params: { pair },
        });
      }
      default:
        throw new Error(`unhandled exchange type: ${exchange}`);
    }
  }

  public getRecentHistory(exchange: EXCHANGE, side: OrderSide, limit: number) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.get<Order[]>(
          `${API_URL}/gate_getRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get<Order[]>(
          `${API_URL}/crypto_getRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get<Order[]>(
          `${API_URL}/coinbase_getRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get<Order[]>(
          `${API_URL}/bybit_getRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      default:
        throw new Error(`unhandled exchange type: ${exchange}`);
    }
  }
}
