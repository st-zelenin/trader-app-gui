import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  EXCHANGE,
  ORDER_TOTAL_MONEY,
  SELL_PRICE_MULTIPLICATOR,
  SELL_VOLUME_DIVIDER,
} from '../../constants';
import {
  Average,
  Balance,
  Multiplicator,
  NewOrder,
  Order,
  OrderFormValues,
  OrderSide,
  PairAverages,
  Ticker,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { HistoryService } from '../history.service';
import { OrderingService } from '../ordering.service';

@Component({
  selector: 'app-pair-card-content',
  templateUrl: './pair-card-content.component.html',
  styleUrls: ['./pair-card-content.component.scss'],
})
export class PairCardContentComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() pair!: string;
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;
  @Input() recent?: Average;
  @Input() openOrders: Order[] = [];

  public displayedColumns: string[] = [
    'ID',
    'update_time_ms',
    'side',
    'price',
    'amount',
    'total',
    'actions',
  ];

  public disableAnimation = true;
  public isNewOrderExpanded = false;

  public balance?: Observable<Balance>;
  public currency = '';
  public buyMultiplicator?: Multiplicator;

  public panelOpenState = false;
  private closeTimeout?: any;
  private openTimeout?: any;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly orderingService: OrderingService,
    private readonly historyService: HistoryService,
    private readonly snackBar: MatSnackBar,
    private readonly facade: AppStoreFacade
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.disableAnimation = false;
    });
  }

  ngOnInit(): void {
    this.currency = this.pair.split(/_|-/)[0];

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.exchange, this.currency);

    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((buyMultiplicator) => {
        this.buyMultiplicator = buyMultiplicator;
      });
  }

  public importAll(): void {
    this.historyService
      .importAll(this.exchange, this.pair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.showSnackBar('history imported');
        this.facade.getAnalytics(this.exchange);
      });
  }

  public updateRecent(): void {
    this.historyService
      .updateRecent(this.exchange, this.pair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.showSnackBar('recent history updated');
      });
  }

  public calcAverages(): void {
    this.facade.getAnalytics(this.exchange);
  }

  public updateTickerInfo() {
    this.facade.getTickers(this.exchange);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  public cancelOrder(order: Order) {
    this.orderingService
      .cancel(this.exchange, order)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.facade.getOpenOrders(this.exchange);
        this.facade.getBalances(this.exchange);
      });
  }

  public createOrder(formValues: OrderFormValues) {
    const order: NewOrder = { ...formValues, currencyPair: this.pair };
    this.orderingService
      .create(this.exchange, order)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.isNewOrderExpanded = false;
        this.facade.getOpenOrders(this.exchange);
        this.facade.getBalances(this.exchange);
      });
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

  public sellRecent() {
    if (this.recent) {
      const price = this.recent.price * SELL_PRICE_MULTIPLICATOR;
      const amount = this.recent.volume / SELL_VOLUME_DIVIDER;
      const order = this.getOrderFormValues('sell', price, amount);

      this.createOrder(order);
    }
  }

  public buyByMultiplicator() {
    if (this.ticker && this.buyMultiplicator) {
      const price = this.ticker.last * (1 - this.buyMultiplicator.value);
      const amount = ORDER_TOTAL_MONEY / price;
      const order = this.getOrderFormValues('buy', price, amount);

      this.createOrder(order);
    }
  }

  private getOrderFormValues(
    side: OrderSide,
    price: number,
    amount: number
  ): OrderFormValues {
    return {
      market: false,
      amount: String(amount),
      price: String(price),
      side,
      total: String(amount * price),
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
