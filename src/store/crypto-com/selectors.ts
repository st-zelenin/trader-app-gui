import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { CryptoComState } from './state';

const selectState = (state: AppState) => state.crypto_com;

export const tickers = createSelector(
  selectState,
  (state: CryptoComState) => state.tickers
);

export const ticker = (id: string) =>
  createSelector(selectState, (state: CryptoComState) => state.tickers[id]);

// export const averages = createSelector(
//   selectState,
//   (state: State) => state.analytics
// );

export const analytics = (id: string) =>
  createSelector(selectState, (state: CryptoComState) => state.analytics[id]);

export const pairOpenOrders = (currencyPair: string) =>
  createSelector(
    selectState,
    (state: CryptoComState) => state.openOrders[currencyPair]
  );

export const currencyBalance = (currency: string) =>
  createSelector(
    selectState,
    (state: CryptoComState) => state.balances[currency]
  );
// export const buyMultiplicator = createSelector(
//   selectState,
//   (state: State) => state.buyMultiplicator
// );
