import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { BotHeaderComponent } from './bot-header/bot-header.component';
import { BotsActionsComponent } from './bots-actions/bots-actions.component';
import { BotFilteringType, BotSortingType } from './bots-actions/bots-actions.constants';
import { BaseBotConfig, type BotDto, BotOrderSide, type BotsResponse } from './bots.interfaces';
import { BottomWeightedBotComponent } from './bottom-weighted/bottom-weighted-bot.component';
import { FilledOrdersComponent } from './filled-orders/filled-orders.component';
import { ProgressiveBotComponent } from './progressive/progressive-bot.component';
import { TrailingBotComponent } from './trailing/trailing-bot.component';
import { API_HUB_URL } from '../../constants';
import { WebSocketService } from '../websocket.service';

interface TraderTickerData {
  last: number;
  changePercentage: number;
}

interface TraderTickersResponse {
  success: boolean;
  data: Record<string, TraderTickerData>;
}

@Component({
  selector: 'app-bots',
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    BotHeaderComponent,
    BotsActionsComponent,
    BottomWeightedBotComponent,
    ProgressiveBotComponent,
    TrailingBotComponent,
  ],
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotsComponent implements OnInit, OnDestroy {
  public readonly loading = signal(true);
  public readonly error = signal<string | undefined>(undefined);
  public readonly bots = signal<BotDto[]>([]);
  public readonly prices = signal<Record<string, number>>({});
  // public readonly filterType = signal<BotFilteringType>(BotFilteringType.NONE);
  // public readonly sortType = signal<BotSortingType>(BotSortingType.NONE);
  // public readonly showFilledType = signal<ShowFilledType | undefined>(undefined);

  private readonly savingBotIds = new Set<string>();
  private readonly httpClient = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly webSocketService = inject(WebSocketService);
  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.httpClient.get<BotsResponse>(`${API_HUB_URL}/binance-bot`).subscribe({
      next: (res) => {
        this.bots.set(res?.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load bots');
        this.loading.set(false);
      },
    });

    this.fetchLatestPrices();

    this.webSocketService.message$
      .pipe(
        filter((message) => message.type === 'prices'),
        map((message) => message.data),
        map((prices: Record<string, string>) => {
          const converted: Record<string, number> = {};
          for (const [symbol, price] of Object.entries(prices)) {
            converted[symbol] = parseFloat(price);
          }

          return converted;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((prices) => {
        this.prices.set(prices);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onConfigSaveRequested<T extends BaseBotConfig>(botId: string, updatedConfig: Partial<T>): void {
    this.savingBotIds.add(botId);

    this.httpClient.put(`${API_HUB_URL}/binance-bot/${botId}/config`, updatedConfig).subscribe({
      next: () => {
        const updatedBots = this.bots().map((bot) => {
          if (bot.id === botId) {
            return { ...bot, config: { ...bot.config, ...updatedConfig }, expanded: false };
          }
          return bot;
        });
        this.bots.set(updatedBots);
        this.savingBotIds.delete(botId);
      },
      error: (err) => {
        console.error('Failed to save bot config:', err);
        this.savingBotIds.delete(botId);
      },
    });
  }

  public isBotSaving(botId: string): boolean {
    return this.savingBotIds.has(botId);
  }

  public onExpansionToggle(bot: BotDto, isExpanded: boolean): void {
    bot.expanded = isExpanded;
    this.bots.set([...this.bots()]);
  }

  public onRefreshBots(): void {
    this.loading.set(true);
    this.error.set(undefined);
    this.ngOnInit();
  }

  public onRefreshPrices(): void {
    this.fetchLatestPrices();
  }

  public onFilter(filterType: BotFilteringType): void {
    console.log('filterType', filterType);
    // this.filterType.set(filterType);
  }

  public onSort(sortType: BotSortingType): void {
    console.log('sortType', sortType);
    // this.sortType.set(sortType);
  }

  public onShowFilled(side: BotOrderSide): void {
    this.dialog.open(FilledOrdersComponent, {
      data: { side },
      width: '90vw',
      maxWidth: '1200px',
      // height: '80vh',
    });
  }

  public get availableBaseCurrency(): number {
    // This would typically come from a balance service or store
    // For now, returning a placeholder value
    return 1000;
  }

  private fetchLatestPrices(): void {
    this.httpClient.get<TraderTickersResponse>(`${API_HUB_URL}/exchange/BINANCE/trader-tickers`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const prices: Record<string, number> = {};
          Object.entries(response.data).forEach(([symbol, tickerData]) => {
            prices[symbol] = tickerData.last;
          });

          this.prices.set(prices);
        }
      },
      error: (err) => {
        console.error('Failed to fetch latest prices:', err);
      },
    });
  }
}
