import { BotType } from '../bots.interfaces';

export interface BotHeaderData {
  id: string;
  symbol: string;
  logoSrc: string;
  truncatedId: string;
  botType: BotType;
  botTypeLabel: string;
  botTypeTooltip: string;
  numPairs: number;
  actualNumPairs: number;
}
