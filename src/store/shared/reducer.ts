import { createReducer, on } from '@ngrx/store';
import { BUY_MULTIPLICATORS } from '../../constants';
import {
  setBuyMultiplicator,
  setDefaultSellPriceMultiplicator,
  setDefaultSellVolumeDivider,
  setOrderDefaultTotalAmount,
} from './actions';
import { SharedState } from './state';

export const initialState: SharedState = {
  buyMultiplicator: BUY_MULTIPLICATORS[0],
  orderDefaultTotalAmount: 4,
  defaultSellVolumeDivider: 3,
  defaultSellPriceMultiplicator: 1.5,
};

export const sharedReducer = createReducer(
  initialState,
  on(setBuyMultiplicator, (state, { buyMultiplicator }) => {
    console.log('set buy multiplicator', buyMultiplicator);
    return { ...state, buyMultiplicator };
  }),
  on(setOrderDefaultTotalAmount, (state, { total }) => {
    console.log('setOrderDefaultTotalAmount', total);
    return { ...state, total };
  }),
  on(setDefaultSellVolumeDivider, (state, { divider }) => {
    console.log('setDefaultSellVolumeDivider', divider);
    return { ...state, divider };
  }),
  on(setDefaultSellPriceMultiplicator, (state, { multiplicator }) => {
    console.log('setDefaultSellPriceMultiplicator', multiplicator);
    return { ...state, multiplicator };
  })
);
