import { createReducer, on } from '@ngrx/store';

import { setBuyMultiplicator, setDefaultSellPriceMultiplicator, setDefaultSellVolumeDivider, setOrderDefaultTotalAmount } from './actions';
import { SharedState } from './state';
import { BUY_MULTIPLICATORS } from '../../constants';

export const initialState: SharedState = {
  buyMultiplicator: BUY_MULTIPLICATORS[0],
  orderDefaultTotalAmount: 4,
  defaultSellVolumeDivider: 3,
  defaultSellPriceMultiplicator: 1.5,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = (action: string, payload: unknown): void => {
  // console.log(action, payload);
};

export const sharedReducer = createReducer(
  initialState,
  on(setBuyMultiplicator, (state, { buyMultiplicator }) => {
    log('set buy multiplicator', buyMultiplicator);
    return { ...state, buyMultiplicator };
  }),
  on(setOrderDefaultTotalAmount, (state, { total }) => {
    log('setOrderDefaultTotalAmount', total);
    return { ...state, total };
  }),
  on(setDefaultSellVolumeDivider, (state, { divider }) => {
    log('setDefaultSellVolumeDivider', divider);
    return { ...state, divider };
  }),
  on(setDefaultSellPriceMultiplicator, (state, { multiplicator }) => {
    log('setDefaultSellPriceMultiplicator', multiplicator);
    return { ...state, multiplicator };
  })
);
