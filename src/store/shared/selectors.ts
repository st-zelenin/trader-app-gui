import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { SharedState } from './state';

const selectState = (state: AppState) => state.shared;

export const buyMultiplicator = createSelector(
  selectState,
  (state: SharedState) => state.buyMultiplicator
);
