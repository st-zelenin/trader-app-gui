import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  API_URL,
  API_URL_BINANCE,
  API_URL_BYBIT,
  API_URL_CRYPTO,
  API_URL_GATE,
  EXCHANGE,
} from '../constants';
import { Order, OrderSide } from '../models';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly httpClient = inject(HttpClient);

  public importAll(exchange: EXCHANGE, pair: string) {
    switch (exchange) {
      case EXCHANGE.GATE_IO: {
        return this.httpClient.get(`${API_URL_GATE}/ImportHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.post(
          `${API_URL_CRYPTO}/ImportHistory_HttpStart`,
          { periodMonths: 12 }
        );
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get(`${API_URL}/coinbase_importHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get(`${API_URL_BYBIT}/ImportHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.get(`${API_URL_BINANCE}/ImportHistory`, {
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
        return this.httpClient.get(`${API_URL_GATE}/UpdateRecentHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get(`${API_URL_CRYPTO}/UpdateRecentHistory`);
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get(`${API_URL}/coinbase_updateTradeHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get(`${API_URL_BYBIT}/UpdateRecentHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.get(`${API_URL_BINANCE}/UpdateRecentHistory`, {
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
        return this.httpClient.get<Order[]>(`${API_URL_GATE}/GetHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get<Order[]>(`${API_URL_CRYPTO}/GetHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.COINBASE: {
        return this.httpClient.get<Order[]>(`${API_URL}/coinbase_getHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BYBIT: {
        return this.httpClient.get<Order[]>(`${API_URL_BYBIT}/GetHistory`, {
          params: { pair },
        });
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.get<Order[]>(`${API_URL_BINANCE}/GetHistory`, {
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
          `${API_URL_GATE}/GetRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      case EXCHANGE.CRYPTO_COM: {
        return this.httpClient.get<Order[]>(
          `${API_URL_CRYPTO}/GetRecentTradeHistory`,
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
          `${API_URL_BYBIT}/GetRecentTradeHistory`,
          {
            params: { side, limit },
          }
        );
      }
      case EXCHANGE.BINANCE: {
        return this.httpClient.get<Order[]>(
          `${API_URL_BINANCE}/GetRecentTradeHistory`,
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
