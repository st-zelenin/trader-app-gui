export interface BotPair {
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
  consolidatedOrder?: ConsolidatedOrder;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly error?: string;
  readonly data?: T;
}

export interface ConsolidatedOrder {
  readonly botId: string;
  readonly sellPrice: number;
  readonly quoteQuantity: number;
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
