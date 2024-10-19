import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EXCHANGE } from '../../constants';
import { Average, Balance, CryptoPair, Filterable, Order, PairAverages, Ticker } from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { CalculationsService } from '../calculations.service';
import { DecimalWithAutoDigitsInfoPipe } from '../decimal-with-auto-digits-info.pipe';
import { FilteringService } from '../filtering.service';
import { PairCardContentComponent } from '../pair-card-content/pair-card-content.component';

@Component({
  selector: 'app-pair-card',
  standalone: true,
  imports: [
    CommonModule,
    DecimalWithAutoDigitsInfoPipe,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    PairCardContentComponent,
    DragDropModule,
  ],
  templateUrl: './pair-card.component.html',
  styleUrls: ['./pair-card.component.scss'],
})
export class PairCardComponent implements OnInit, OnDestroy, Filterable {
  @Input() public pair!: CryptoPair;
  @Input() public exchange!: EXCHANGE;

  @Output() public readonly remove = new EventEmitter<string>();

  public isOpened = false;

  public ticker?: Ticker;
  public balance?: Balance;
  public averages?: PairAverages;
  public recent?: Average;
  public openOrders: Order[] = [];
  public priceDown = true;
  public buyOrders = 0;
  public sellOrders = 0;
  public logoSrc = '';
  public estimatedTotal = 0;

  public headerColor = 'rgb(255, 255, 255)';

  public attentionMessage = '';
  public analyticsMessage = '';

  @HostBinding('class.hidden') public hidden: boolean = false;
  @HostBinding('class.expanded') public isExpanded: boolean = false;

  private closeTimeout?: any;
  private openTimeout?: any;

  private readonly filteringService = inject(FilteringService);
  private readonly calculationsService = inject(CalculationsService);
  private readonly facade = inject(AppStoreFacade);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    const baseCurrency = this.calculationsService.getBaseCurrency(this.pair.symbol, this.exchange);
    this.logoSrc = `assets/coins/${baseCurrency}.png`;

    this.filteringService.register(this);

    this.facade
      .ticker(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ticker) => {
        this.ticker = ticker;
        this.priceDown = this.ticker ? this.ticker.change_percentage < 0 : false;
        this.headerColor = this.updateHeaderColor();

        this.calculateEstimatedTotal();
        this.cdr.markForCheck();
      });

    this.facade
      .balance(this.exchange, baseCurrency)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((balance) => {
        this.balance = balance;

        this.calculateEstimatedTotal();
        this.cdr.markForCheck();
      });

    this.facade
      .analytics(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((analytics) => {
        this.averages = analytics;
        this.analyticsMessage = this.getAnalyticsMessage(analytics);
        this.headerColor = this.updateHeaderColor();

        this.cdr.markForCheck();
      });

    this.facade
      .pairOpenOrders(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orders: Order[]) => {
        if (orders && orders.length) {
          this.buyOrders = orders.filter(({ side }) => side === 'buy').length;
          this.sellOrders = orders.filter(({ side }) => side === 'sell').length;
          this.openOrders = orders;
        } else {
          this.buyOrders = 0;
          this.sellOrders = 0;
          this.openOrders = [];
        }

        this.checkNeedsAttention();
        this.cdr.markForCheck();
      });

    this.facade
      .pairRecentBuyAverages(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((recent) => {
        this.recent = recent;
        this.checkNeedsAttention();
        this.cdr.markForCheck();
      });
  }

  public get isRed(): boolean {
    return (this.ticker && this.averages && this.averages.buy.price > 0 && this.ticker.last < this.averages.buy.price) || false;
  }

  public get isGreen(): boolean {
    return !!this.ticker && !!this.averages && this.averages.buy.price > 0 && this.ticker.last > this.averages.buy.price;
  }

  public onPanelOpen(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }

    this.openTimeout = setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  public onPanelClose(): void {
    this.isExpanded = false;

    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.isOpened = false;
    }, 2000);
  }

  public removeCard(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.pair.symbol);
  }

  public toggleExpand(event: Event): void {
    if (this.isOpened) {
      event.stopPropagation();
    }

    this.isExpanded = !this.isExpanded;
  }

  public ngOnDestroy(): void {
    this.filteringService.unregister(this);
  }

  private updateHeaderColor(): string {
    if (this.isGreen) {
      const redBlue = 250 - Math.floor(((this.ticker!.last - this.averages!.buy.price) / this.ticker!.last) * 100);
      return `rgb(${redBlue}, 255, ${redBlue})`;
    }

    if (this.isRed) {
      const greenBlue = 250 - Math.floor(((this.averages!.buy.price - this.ticker!.last) / this.averages!.buy.price) * 100);
      return `rgb(255, ${greenBlue}, ${greenBlue})`;
    }

    return 'rgb(255, 255, 255)';
  }

  private checkNeedsAttention(): void {
    this.attentionMessage = '';

    if (this.recent && this.openOrders && this.openOrders.length) {
      const buyOrders = this.openOrders.filter(({ side }) => side === 'sell');
      if (buyOrders.length === 1) {
        const { amount } = buyOrders[0];
        const targetAmount = this.recent.volume / 3;
        if (targetAmount / amount > 1.001) {
          this.attentionMessage = `recent sell diff: ${targetAmount / amount}`;
        }
      }
    }
  }

  private calculateEstimatedTotal(): void {
    if (!this.ticker || !this.balance) {
      return;
    }

    this.estimatedTotal = this.calculationsService.calcEstimatedTotal(this.ticker, this.balance);
  }

  private getAnalyticsMessage(analytics: PairAverages): string {
    const precision = this.pair.symbol.endsWith('BTC') ? 100000000 : 100;

    const totalBuy = Math.round(analytics?.buy.money * precision) / precision;
    const totalSell = Math.round(analytics?.sell.money * precision) / precision;
    const diff = Math.round((totalSell - totalBuy) * precision) / precision;

    return `
    bought: ${totalBuy}
    sold: ${totalSell}
    diff: ${diff}
    `;
  }
}
