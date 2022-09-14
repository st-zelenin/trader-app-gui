import { createSelector } from '@ngrx/store';
import { AppState } from '../models';
import { SharedState } from './state';

const selectState = (state: AppState) => state.shared;

export const buyMultiplicator = createSelector(
  selectState,
  (state: SharedState) => state.buyMultiplicator
);

export const orderDefaultTotalAmount = createSelector(
  selectState,
  (state: SharedState) => state.orderDefaultTotalAmount
);

export const defaultSellVolumeDivider = createSelector(
  selectState,
  (state: SharedState) => state.defaultSellVolumeDivider
);

export const defaultSellPriceMultiplicator = createSelector(
  selectState,
  (state: SharedState) => state.defaultSellPriceMultiplicator
);
