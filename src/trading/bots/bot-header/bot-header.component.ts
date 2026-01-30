import { ChangeDetectionStrategy, Component, Signal, TemplateRef, computed, inject, input, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EXCHANGE } from 'src/constants';
import { CryptoPair } from 'src/models';

import { BotHeaderData } from './bot-header.interfaces';
import { TradingViewWidgetComponent } from '../../trading-view-widget/trading-view-widget.component';
import { BotDto, BotType } from '../bots.interfaces';

@Component({
  selector: 'app-bot-header',
  imports: [MatTooltipModule, MatButtonModule, MatIconModule, MatDialogModule, TradingViewWidgetComponent],
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

    const [{ buyPrice, sellPrice }] = pairs;
    if (!buyPrice) {
      return null;
    }

    const percentage = ((currentPrice - buyPrice) / buyPrice) * 100;

    return {
      value: percentage,
      isPositive: percentage >= 0,
      formatted: percentage.toFixed(2),
      sellPrice,
    };
  });

  public readonly tradingViewPair = computed<CryptoPair>(() => {
    const symbol = this.bot().config.symbol;
    // Extract base symbol (remove quote currency, e.g., "USDC" or "USDT")
    const baseSymbol = symbol.substring(0, symbol.length - 4);
    return {
      symbol: `${baseSymbol}USDT`,
      isArchived: false,
    };
  });

  public readonly tradingViewExchange = computed(() => EXCHANGE.BINANCE);

  private readonly dialog = inject(MatDialog);

  private readonly tradingViewTemplate = viewChild<TemplateRef<unknown>>('tradingViewTemplate');

  public openTradingView(event: MouseEvent): void {
    event.stopPropagation();

    const template = this.tradingViewTemplate();
    if (!template) {
      return;
    }

    this.dialog.open(template, {
      width: '90vw',
      maxWidth: '1400px',
      height: '90vh',
      autoFocus: false,
    });
  }

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
