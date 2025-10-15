import { ChangeDetectionStrategy, Component, Signal, computed, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

import { BotHeaderData } from './bot-header.interfaces';
import { BotDto, BotType } from '../bots.interfaces';

@Component({
  selector: 'app-bot-header',
  imports: [MatTooltip],
  templateUrl: './bot-header.component.html',
  styleUrl: './bot-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotHeaderComponent {
  public readonly bot = input.required<BotDto>();
  public readonly price = input<number>();
  public readonly BotType = BotType;

  public readonly data: Signal<BotHeaderData> = computed(() => ({
    id: this.bot().id,
    truncatedId: `...${this.bot().id.slice(-6)}`,
    logoSrc: `assets/coins/${this.bot().config.symbol.substring(0, this.bot().config.symbol.length - 4)}.png`,
    symbol: this.bot().config.symbol.substring(0, this.bot().config.symbol.length - 4),
    botType: this.bot().config.botType,
    botTypeLabel: this.getBotTypeAbbreviation(this.bot().config.botType),
    botTypeTooltip: this.bot().config.botType,
    numPairs: this.bot().config.numPairs,
    actualNumPairs: this.bot().pairs?.length || 0,
  }));

  public readonly lowestBuyDiff = computed(() => {
    const currentPrice = this.price();
    const { pairs } = this.bot();

    if (!currentPrice || !pairs?.length) {
      return null;
    }

    const [{ buyPrice }] = pairs;
    if (!buyPrice) {
      return null;
    }

    const percentage = ((currentPrice - buyPrice) / buyPrice) * 100;

    return {
      value: percentage,
      isPositive: percentage >= 0,
      formatted: percentage.toFixed(2),
    };
  });

  private getBotTypeAbbreviation(botType: BotType): string {
    switch (botType) {
      case BotType.Progressive:
        return 'PR';
      case BotType.Trailing:
        return 'TR';
      case BotType.BottomWeighted:
        return 'BW';
      default:
        throw new Error(`Unhandled bot type: ${botType}`);
    }
  }
}
