import { Injectable } from '@angular/core';
import { EXCHANGE } from 'src/constants';
import { Balances, OpenOrdersByPairs, Tickers } from '../models';
import { CalculationsService } from './calculations.service';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  constructor(private readonly calculationsService: CalculationsService) {}

  public sortBySellOrder(
    pairs: string[],
    openOrders: OpenOrdersByPairs,
    tickers: Tickers
  ) {
    const withDiffs = pairs.map((pair) => {
      const sellOrders = (openOrders[pair] || []).filter(
        ({ side }) => side === 'sell'
      );
      const currPrice = tickers[pair]?.last || 0;

      let diff = undefined;
      for (const { price } of sellOrders) {
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
      .sort((a, b) => a.diff! - b.diff!)
      .map(({ name }) => name)
      .concat(
        ...withDiffs
          .filter(({ diff }) => diff === undefined)
          .map(({ name }) => name)
      );
  }

  public sortByEstimatedTotal(
    pairs: string[],
    balances: Balances,
    tickers: Tickers,
    exchange: EXCHANGE
  ) {
    const withEstimatedTotals = pairs.map((pair) => {
      const currency = this.calculationsService.getBaseCurrency(pair, exchange);
      const total = this.calculationsService.calcEstimatedTotal(
        tickers[pair],
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

  public sortByHighestChange(pairs: string[], tickers: Tickers) {
    return pairs
      .map((pair) => ({ pair, change: tickers[pair]?.change_percentage || 0 }))
      .sort((a, b) => b.change - a.change)
      .map(({ pair }) => pair);
  }
}
