import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  CryptoPair,
  Multiplicator,
  NewOrder,
  Order,
  OrderFormValues,
  OrderSide,
  PairAverages,
  Product,
  SelectedOrdersInfo,
  Ticker,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { CalculationsService } from '../calculations.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../confirmation-dialog/confirmation-dialog.component';
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
  @Input() pair!: CryptoPair;
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;
  @Input() recent?: Average;
  @Input() openOrders: Order[] = [];
  @Input() isExpanded!: boolean;

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
  public showFishnet = false;

  public balance: Observable<Balance> | undefined = undefined;
  public product: Observable<Product | null> | null = null;
  public buyMultiplicator?: Multiplicator;
  public orderDefaultTotalAmount?: number;
  public defaultSellVolumeDivider?: number;
  public defaultSellPriceMultiplicator?: number;

  public sellForBtc?: { amount: number; price: number };

  public selectedOrdersInfo: SelectedOrdersInfo = {
    price: 0,
    amount: 0,
    total: 0,
  };

  public isOpened = false;
  private closeTimeout?: any;
  private openTimeout?: any;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly orderingService: OrderingService,
    private readonly historyService: HistoryService,
    private readonly calculationsService: CalculationsService,
    private readonly snackBar: MatSnackBar,
    private readonly facade: AppStoreFacade,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.disableAnimation = false;
    });
  }

  ngOnInit(): void {
    const baseCurrency = this.calculationsService.getBaseCurrency(
      this.pair.symbol,
      this.exchange
    );

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.exchange, baseCurrency);
    this.product = this.facade.product(this.exchange, this.pair.symbol);

    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((buyMultiplicator) => {
        this.buyMultiplicator = buyMultiplicator;
      });

    this.facade.orderDefaultTotalAmount
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => {
        this.orderDefaultTotalAmount = total;
      });

    this.facade.defaultSellVolumeDivider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((divider) => {
        this.defaultSellVolumeDivider = divider;
      });

    this.facade.defaultSellPriceMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((multiplicator) => {
        this.defaultSellPriceMultiplicator = multiplicator;
      });
  }

  public importAll(): void {
    this.historyService
      .importAll(this.exchange, this.pair.symbol)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.showSnackBar('history imported');
        this.facade.getAnalytics(this.exchange);
      });
  }

  public updateRecent(): void {
    this.historyService
      .updateRecent(this.exchange, this.pair.symbol)
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
    const message = this.validateOrder(formValues);
    if (message) {
      const dialogRef = this.dialog.open<
        ConfirmationDialogComponent,
        ConfirmationDialogData,
        boolean
      >(ConfirmationDialogComponent, {
        data: { title: 'Achtung!', message },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.placeNewOrder(formValues);
        }
      });
    } else {
      this.placeNewOrder(formValues);
    }
  }

  private placeNewOrder(formValues: OrderFormValues) {
    const order: NewOrder = { ...formValues, currencyPair: this.pair.symbol };
    this.orderingService
      .create(this.exchange, order)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        () => {
          this.isNewOrderExpanded = false;
          this.facade.getOpenOrders(this.exchange);
          this.facade.getBalances(this.exchange);
          this.facade.getRecentBuyAverages(this.exchange);
        },
        (err) => {
          let message = 'failed to create order';
          if (err.error?.message) {
            message = err.error.label
              ? `${err.error.label}: ${err.error?.message}`
              : err.error?.message;
          }

          this.snackBar.open(message, 'x', {
            // duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['warning'],
          });
        }
      );
  }

  private validateOrder(formValues: OrderFormValues): string {
    if (formValues.side === 'sell' && this.ticker) {
      const price = Number(formValues.price);
      if (price < this.ticker.last) {
        return `Current price ${this.ticker.last} is heigher than order SELL price ${price}. Are you shure?`;
      }
    }

    if (formValues.side === 'buy' && this.ticker) {
      const price = Number(formValues.price);
      if (price > this.ticker.last) {
        return `Current price ${this.ticker.last} is less than order BUY price ${price}. Are you shure?`;
      }
    }

    return '';
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
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.isOpened = false;
    }, 2000);
  }

  public sellRecent() {
    if (
      this.recent &&
      this.defaultSellPriceMultiplicator &&
      this.defaultSellVolumeDivider
    ) {
      const price = this.recent.price * this.defaultSellPriceMultiplicator;
      const amount = this.recent.volume / this.defaultSellVolumeDivider;
      const order = this.getOrderFormValues('sell', price, amount);

      this.createOrder(order);
    }
  }

  public buyByMultiplicator() {
    if (this.ticker && this.buyMultiplicator && this.orderDefaultTotalAmount) {
      const price = this.ticker.last * (1 - this.buyMultiplicator.value);
      const amount = this.orderDefaultTotalAmount / price;
      const order = this.getOrderFormValues('buy', price, amount);

      this.createOrder(order);
    }
  }

  public toggleFishnet() {
    this.showFishnet = !this.showFishnet;
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
