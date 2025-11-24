export interface TradingPair {
  id: string;
  buyPrice: number;
  buyFilled: boolean;
  quantity: number;
  sellPrice: number;
  buyOrderId?: number;
}

export interface ExtendedTradingPair extends TradingPair {
  buyAmount: number;
  sellAmount: number;
  difference: number;
}

export interface TradingPairsResponse {
  success: boolean;
  data: TradingPair[];
}

export interface BottomWeightedPairsDialogData {
  botId: string;
}
