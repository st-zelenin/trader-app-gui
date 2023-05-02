import { Injectable } from '@angular/core';
import { EXCHANGE } from 'src/constants';
import {
  Balances,
  CryptoPair,
  OpenOrdersByPairs,
  OrderSide,
  Tickers,
} from '../models';
import { CalculationsService } from './calculations.service';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  constructor(private readonly calculationsService: CalculationsService) {}

  public sortByupcomingOrder(
    pairs: CryptoPair[],
    openOrders: OpenOrdersByPairs,
    tickers: Tickers,
    orderSide: OrderSide
  ) {
    const withDiffs = pairs.map((pair) => {
      const orders = (openOrders[pair.symbol] || []).filter(
        ({ side }) => side === orderSide
      );
      const currPrice = tickers[pair.symbol]?.last || 0;

      let diff = undefined;
      for (const { price } of orders) {
        if (diff === undefined) {
          diff = (price - currPrice) / price;
        } else {
          const tmp = (price - currPrice) / price;
          diff = diff < tmp ? diff : tmp;
        }
      }

      console.log(pair, diff);
      return { name: pair, diff };
    });

    return withDiffs
      .filter(({ diff }) => diff !== undefined)
      .sort((a, b) =>
        orderSide === 'sell' ? a.diff! - b.diff! : b.diff! - a.diff!
      )
      .map(({ name }) => name)
      .concat(
        ...withDiffs
          .filter(({ diff }) => diff === undefined)
          .map(({ name }) => name)
      );
  }

  public sortByEstimatedTotal(
    pairs: CryptoPair[],
    balances: Balances,
    tickers: Tickers,
    exchange: EXCHANGE
  ) {
    const withEstimatedTotals = pairs.map((pair) => {
      const currency = this.calculationsService.getBaseCurrency(
        pair.symbol,
        exchange
      );
      const total = this.calculationsService.calcEstimatedTotal(
        tickers[pair.symbol],
        balances[currency]
      );
      return { name: pair, total };
    });

    return withEstimatedTotals
      .filter(({ total }) => total > 0)
      .sort((a, b) => b.total - a.total)
      .map(({ name }) => name)
      .concat(
        ...withEstimatedTotals
          .filter(({ total }) => total <= 0)
          .map(({ name }) => name)
      );
  }

  public sortByHighestChange(pairs: CryptoPair[], tickers: Tickers) {
    return pairs
      .map((pair) => ({
        pair,
        change: tickers[pair.symbol]?.change_percentage || 0,
      }))
      .sort((a, b) => b.change - a.change)
      .map(({ pair }) => pair);
  }
}
