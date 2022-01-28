import { createSelector } from '@ngrx/store';
import { AppState } from '../models';
import { SharedState } from './state';

const selectState = (state: AppState) => state.shared;

export const buyMultiplicator = createSelector(
  selectState,
  (state: SharedState) => state.buyMultiplicator
);
