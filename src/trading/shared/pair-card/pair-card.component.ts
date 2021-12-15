import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { EXCHANGE } from '../../../constants';
import { FilteringService } from '../../../filtering.service';
import { Filterable, Order, PairAverages, Ticker } from '../../../models';
import { AppStoreFacade } from '../../../store/facade';

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
  public averages?: PairAverages;
  public openOrders: Order[] = [];
  public priceDown = true;
  public buyOrders = 0;
  public sellOrders = 0;
  public logoSrc = '';

  public headerColor = 'rgb(255, 255, 255)';

  private closeTimeout?: any;
  private openTimeout?: any;

  constructor(
    private readonly filteringService: FilteringService,
    private readonly facade: AppStoreFacade
  ) {}

  @HostBinding('class.hidden') hidden: boolean = false;

  ngOnInit(): void {
    this.logoSrc = `assets/coins/${this.pair.split('_')[0]}.png`;

    this.filteringService.register(this);

    this.facade.ticker(this.exchange, this.pair).subscribe((ticker) => {
      this.ticker = ticker;
      this.priceDown = this.ticker ? this.ticker.change_percentage < 0 : false;
      this.headerColor = this.updateHeaderColor();
    });

    this.facade.analytics(this.exchange, this.pair).subscribe((analytics) => {
      this.averages = analytics;
      this.headerColor = this.updateHeaderColor();
    });

    this.facade
      .pairOpenOrders(this.exchange, this.pair)
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

  ngOnDestroy(): void {
    this.filteringService.unregister(this);
  }
}
