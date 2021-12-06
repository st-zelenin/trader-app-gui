import { TickerInfo } from './tickers';
import { PairAverages } from './trade-averages';

export interface TradePair {
  id: string;
  panelOpenState: boolean;
  ticker?: TickerInfo;
  averages?: PairAverages;
}
