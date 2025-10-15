interface BotPair {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyOrderId?: number;
  sellOrderId?: number;
}

export type BotOrderSide = 'buy' | 'sell';

export enum BotType {
  Progressive = 'progressive',
  Trailing = 'trailing',
  BottomWeighted = 'bottom-weighted',
}

export interface BaseBotConfig {
  botType: BotType;
  symbol: string;
  mode: string;
  numPairs: number;
}

export interface ProgressiveBotConfig extends BaseBotConfig {
  initialPercentDelta: number;
  deltaIncrement: number;
  amountToBuy: number;
  earnInBaseAsset: boolean;
}

export interface TrailingBotConfig extends BaseBotConfig {
  capital: number;
  topPrice: number;
  bottomPrice: number;
  maxTrailingDelta: number;
}

export interface BottomWeightedBotConfig extends BaseBotConfig {
  priceTop: number;
  percentStep: number;
  targetAverageCapitalPerLevel: number;
}

export type BotConfig = ProgressiveBotConfig | TrailingBotConfig | BottomWeightedBotConfig;

export interface BotDto {
  id: string;
  config: BotConfig;
  pairs: BotPair[];
  expanded?: boolean;
}

export interface BotsResponse {
  success: boolean;
  data: BotDto[];
}

export interface ProgressiveBot {
  id: string;
  config: ProgressiveBotConfig;
  pairs: BotPair[];
}

export interface TrailingBot {
  id: string;
  config: TrailingBotConfig;
  pairs: BotPair[];
}

export interface BottomWeightedBot {
  id: string;
  config: BottomWeightedBotConfig;
  pairs: BotPair[];
}
