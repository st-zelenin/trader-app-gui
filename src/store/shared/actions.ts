import { createAction, props } from '@ngrx/store';
import { Multiplicator } from '../../models';

export enum ACTIONS {
  SET_BUY_MULTIPLICATOR = '[shared][Multiplicators] set buy multiplicator',
}

export const setBuyMultiplicator = createAction(
  ACTIONS.SET_BUY_MULTIPLICATOR,
  props<{ buyMultiplicator: Multiplicator }>()
);
