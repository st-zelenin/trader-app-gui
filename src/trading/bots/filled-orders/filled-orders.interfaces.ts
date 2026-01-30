import { BotOrderSide } from '../bots.interfaces';

export interface FilledOrder {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: 'BUY' | 'SELL';
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  workingTime: number;
  origQuoteOrderQty: string;
  selfTradePreventionMode: string;
  botId: string;
}

export interface FilledOrdersResponse {
  success: boolean;
  data: PagedData<FilledOrder>;
}

export interface PagedData<T> {
  items: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface ProcessedFilledOrder {
  symbol: string;
  orderId: number;
  updateTime: number;
  executedQty: number;
  price: number;
  total: number;
  side: 'BUY' | 'SELL';
}

export interface FilledOrdersDialogData {
  side: BotOrderSide;
  botId?: string;
}
