import { Order } from './orders';

export interface Filterable {
  hidden: boolean;
  readonly isRed: boolean;
  openOrders: Order[];
}
