import { createAction, props } from '@ngrx/store';
import { Multiplicator } from '../../models';

export enum ACTIONS {
  SET_BUY_MULTIPLICATOR = '[shared] set buy multiplicator',
  SET_ORDER_DEFAULT_TOTAL_AMOUNT = '[shared] set order default total amount',
  SET_DEFAULT_SELL_VOLUME_DIVIDER = '[shared] set default sell volume divider',
  SET_DEFAULT_SELL_PRICE_MULTIPLICATOR = '[shared] set default sell price multiplicator',
}

export const setBuyMultiplicator = createAction(
  ACTIONS.SET_BUY_MULTIPLICATOR,
  props<{ buyMultiplicator: Multiplicator }>()
);

export const setOrderDefaultTotalAmount = createAction(
  ACTIONS.SET_ORDER_DEFAULT_TOTAL_AMOUNT,
  props<{ total: number }>()
);

export const setDefaultSellVolumeDivider = createAction(
  ACTIONS.SET_DEFAULT_SELL_VOLUME_DIVIDER,
  props<{ divider: number }>()
);

export const setDefaultSellPriceMultiplicator = createAction(
  ACTIONS.SET_DEFAULT_SELL_PRICE_MULTIPLICATOR,
  props<{ multiplicator: number }>()
);
