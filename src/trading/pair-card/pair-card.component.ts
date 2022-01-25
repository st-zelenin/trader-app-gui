import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  Filterable,
  Order,
  PairAverages,
  Ticker,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { FilteringService } from '../filtering.service';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-pair-card',
  templateUrl: './pair-card.component.html',
  styleUrls: ['./pair-card.component.scss'],
})
export class PairCardComponent implements OnInit, OnDestroy, Filterable {
  @Input() pair!: string;
  @Input() exchange!: EXCHANGE;

  @Output() remove = new EventEmitter<string>();

  public panelOpenState = false;
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

  private closeTimeout?: any;
  private openTimeout?: any;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly filteringService: FilteringService,
    private readonly historyService: HistoryService,
    private readonly facade: AppStoreFacade
  ) {}

  @HostBinding('class.hidden') hidden: boolean = false;

  ngOnInit(): void {
    this.logoSrc = `assets/coins/${this.pair.split(/-|_/)[0]}.png`;

    this.filteringService.register(this);

    this.facade
      .ticker(this.exchange, this.pair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((ticker) => {
        this.ticker = ticker;
        this.priceDown = this.ticker
          ? this.ticker.change_percentage < 0
          : false;
        this.headerColor = this.updateHeaderColor();

        this.calcEstimatedTotal();
      });

    const currency = this.pair.split(/_|-/)[0];
    this.facade
      .balance(this.exchange, currency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((balance) => {
        this.balance = balance;

        this.calcEstimatedTotal();
      });

    this.facade
      .analytics(this.exchange, this.pair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((analytics) => {
        this.averages = analytics;
        this.headerColor = this.updateHeaderColor();
      });

    this.facade
      .pairOpenOrders(this.exchange, this.pair)
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
      });

    this.historyService
      .getRecentBuyAverages(this.exchange, this.pair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((recent) => {
        this.recent = recent;
        this.checkNeedsAttention();
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
      this.panelOpenState = true;
    }, 0);
  }

  public onPanelClose() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.panelOpenState = false;
    }, 2000);
  }

  public removeCard(event: Event) {
    event.stopPropagation();
    this.remove.emit(this.pair);
  }

  private calcEstimatedTotal() {
    this.estimatedTotal =
      this.ticker && this.balance
        ? this.ticker.last * (this.balance.available + this.balance.locked)
        : 0;
    console.log(this.pair, this.estimatedTotal, this.ticker, this.balance);
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

  ngOnDestroy(): void {
    this.filteringService.unregister(this);

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
