import { Multiplicator } from '../../models';

export interface SharedState {
  buyMultiplicator: Multiplicator;
  orderDefaultTotalAmount: number;
  defaultSellVolumeDivider: number;
  defaultSellPriceMultiplicator: number;
}
