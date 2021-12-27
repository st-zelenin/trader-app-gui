import { Injectable } from '@angular/core';
import { OpenOrdersByPairs, Tickers } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  constructor() {}

  public sort(
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
}
