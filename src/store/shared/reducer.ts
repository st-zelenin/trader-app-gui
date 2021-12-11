import { createReducer, on } from '@ngrx/store';
import { BUY_MULTIPLICATORS } from '../../constants';
import { setBuyMultiplicator } from './actions';
import { SharedState } from './state';

export const initialState: SharedState = {
  buyMultiplicator: BUY_MULTIPLICATORS[0],
};

export const sharedReducer = createReducer(
  initialState,
  on(setBuyMultiplicator, (state, { buyMultiplicator }) => {
    console.log('set buy multiplicator', buyMultiplicator);
    return { ...state, buyMultiplicator };
  })
);
