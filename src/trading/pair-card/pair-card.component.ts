import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  CryptoPair,
  Filterable,
  Order,
  PairAverages,
  Ticker,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { CalculationsService } from '../calculations.service';
import { FilteringService } from '../filtering.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { PairCardContentComponent } from '../pair-card-content/pair-card-content.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DecimalWithAutoDigitsInfoPipe } from '../decimal-with-auto-digits-info.pipe';

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
  host: {
    '[class.expanded]': 'isExpanded',
  },
})
export class PairCardComponent implements OnInit, OnDestroy, Filterable {
  @Input() pair!: CryptoPair;
  @Input() exchange!: EXCHANGE;

  @Output() remove = new EventEmitter<string>();

  public isOpened = false;
  public isExpanded = false;

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

  private closeTimeout?: any;
  private openTimeout?: any;

  private readonly filteringService = inject(FilteringService);
  private readonly calculationsService = inject(CalculationsService);
  private readonly facade = inject(AppStoreFacade);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly unsubscribe$ = new Subject<void>();

  @HostBinding('class.hidden') hidden: boolean = false;

  ngOnInit(): void {
    const baseCurrency = this.calculationsService.getBaseCurrency(
      this.pair.symbol,
      this.exchange
    );
    this.logoSrc = `assets/coins/${baseCurrency}.png`;

    this.filteringService.register(this);

    this.facade
      .ticker(this.exchange, this.pair.symbol)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((ticker) => {
        this.ticker = ticker;
        this.priceDown = this.ticker
          ? this.ticker.change_percentage < 0
          : false;
        this.headerColor = this.updateHeaderColor();

        this.calculateEstimatedTotal();
        this.cdr.markForCheck();
      });

    this.facade
      .balance(this.exchange, baseCurrency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((balance) => {
        this.balance = balance;

        this.calculateEstimatedTotal();
        this.cdr.markForCheck();
      });

    this.facade
      .analytics(this.exchange, this.pair.symbol)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((analytics) => {
        this.averages = analytics;
        this.analyticsMessage = this.getAnalyticsMessage(analytics);
        this.headerColor = this.updateHeaderColor();

        this.cdr.markForCheck();
      });

    this.facade
      .pairOpenOrders(this.exchange, this.pair.symbol)
      .pipe(takeUntil(this.unsubscribe$))
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
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((recent) => {
        this.recent = recent;
        this.checkNeedsAttention();
        this.cdr.markForCheck();
      });
  }

  public get isRed() {
    return (
      (this.ticker &&
        this.averages &&
        this.averages.buy.price > 0 &&
        this.ticker.last < this.averages.buy.price) ||
      false
    );
  }

  public get isGreen() {
    return (
      this.ticker &&
      this.averages &&
      this.averages.buy.price > 0 &&
      this.ticker.last > this.averages.buy.price
    );
  }

  private updateHeaderColor() {
    if (this.isGreen) {
      const redBlue =
        250 -
        Math.floor(
          ((this.ticker!.last - this.averages!.buy.price) / this.ticker!.last) *
            100
        );
      return `rgb(${redBlue}, 255, ${redBlue})`;
    }

    if (this.isRed) {
      const greenBlue =
        250 -
        Math.floor(
          ((this.averages!.buy.price - this.ticker!.last) /
            this.averages!.buy.price) *
            100
        );
      return `rgb(255, ${greenBlue}, ${greenBlue})`;
    }

    return 'rgb(255, 255, 255)';
  }

  public onPanelOpen() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }

    this.openTimeout = setTimeout(() => {
      this.isOpened = true;
    }, 0);
  }

  public onPanelClose() {
    this.isExpanded = false;

    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.isOpened = false;
    }, 2000);
  }

  public removeCard(event: Event) {
    event.stopPropagation();
    this.remove.emit(this.pair.symbol);
  }

  public toggleExpand(event: Event) {
    if (this.isOpened) {
      event.stopPropagation();
    }

    this.isExpanded = !this.isExpanded;
  }

  private checkNeedsAttention() {
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

  private calculateEstimatedTotal() {
    if (!this.ticker || !this.balance) {
      return;
    }

    this.estimatedTotal = this.calculationsService.calcEstimatedTotal(
      this.ticker,
      this.balance
    );
  }

  private getAnalyticsMessage(analytics: PairAverages) {
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

  ngOnDestroy(): void {
    this.filteringService.unregister(this);

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
