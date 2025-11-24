import { BotPair } from '../bots.interfaces';

export interface ExtendedProgressivePair extends BotPair {
  difference: number;
}

export interface ProgressivePairsDialogData {
  pairs: BotPair[];
}
