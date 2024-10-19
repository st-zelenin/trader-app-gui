import { Order } from './orders';

export interface Filterable {
  hidden: boolean;
  readonly isRed: boolean;
  openOrders: Order[];
  attentionMessage: string;
}

export enum FilteringType {
  NONE = 'NONE',
  MISSING_BUY = 'MISSING_BUY',
  ATTENTION_MESSAGE = 'ATTENTION_MESSAGE',
}
