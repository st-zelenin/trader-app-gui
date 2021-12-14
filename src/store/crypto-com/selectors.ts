import { createSelector, defaultMemoize } from '@ngrx/store';
import { AppState } from '../state';
import { CryptoComState } from './state';

const selectState = (state: AppState) => state.crypto_com;

export const tickers = createSelector(
  selectState,
  (state: CryptoComState) => state.tickers
);

const tickerById = (id: string) =>
  createSelector(selectState, (state: CryptoComState) => state.tickers[id]);

export const ticker = (id: string) => defaultMemoize(tickerById).memoized(id);

// export const averages = createSelector(
//   selectState,
//   (state: State) => state.analytics
// );

const averageById = (id: string) =>
  createSelector(selectState, (state: CryptoComState) => state.analytics[id]);

export const analytics = (id: string) =>
  defaultMemoize(averageById).memoized(id);

const ordersByCurrencyPair = (currencyPair: string) =>
  createSelector(
    selectState,
    (state: CryptoComState) => state.openOrders[currencyPair]
  );

export const pairOpenOrders = (currencyPair: string) =>
  defaultMemoize(ordersByCurrencyPair).memoized(currencyPair);

const balanceByCurrency = (currency: string) =>
  createSelector(
    selectState,
    (state: CryptoComState) => state.balances[currency]
  );

export const currencyBalance = (currency: string) =>
  defaultMemoize(balanceByCurrency).memoized(currency);

// export const buyMultiplicator = createSelector(
//   selectState,
//   (state: State) => state.buyMultiplicator
// );
