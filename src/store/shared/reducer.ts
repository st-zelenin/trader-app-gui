import { createReducer, on } from '@ngrx/store';
import { BUY_MULTIPLICATORS, EXCHANGE } from '../../constants';
import {
  setActiveTab,
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
  activeTab: EXCHANGE.GATE_IO,
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
  }),
  on(setActiveTab, (state, { activeTab }) => {
    console.log('setActiveTab', activeTab);
    return { ...state, activeTab };
  })
);
