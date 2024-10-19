import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, tap } from 'rxjs';

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
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';
import { DecimalWithAutoDigitsInfoPipe } from '../decimal-with-auto-digits-info.pipe';
import { FishnetComponent } from '../fishnet/fishnet.component';
import { HistoryService } from '../history.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderingService } from '../ordering.service';
import { TradeHistoryComponent } from '../trade-history/trade-history.component';
import { TradingViewWidgetComponent } from '../trading-view-widget/trading-view-widget.component';

@Component({
  selector: 'app-pair-card-content',
  standalone: true,
  imports: [
    CommonModule,
    DecimalWithAutoDigitsInfoPipe,
    ClipboardModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    MatIconModule,
    TradeHistoryComponent,
    TradingViewWidgetComponent,
    OrderFormComponent,
    FishnetComponent,
  ],
  templateUrl: './pair-card-content.component.html',
  styleUrls: ['./pair-card-content.component.scss'],
})
export class PairCardContentComponent implements OnInit, AfterViewInit {
  @Input() public pair!: CryptoPair;
  @Input() public exchange!: EXCHANGE;
  @Input() public ticker?: Ticker;
  @Input() public averages?: PairAverages;
  @Input() public recent?: Average;
  @Input() public openOrders: Order[] = [];
  @Input() public isExpanded!: boolean;

  public displayedColumns: string[] = ['ID', 'update_time_ms', 'side', 'price', 'amount', 'total', 'actions'];

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

  private readonly orderingService = inject(OrderingService);
  private readonly historyService = inject(HistoryService);
  private readonly calculationsService = inject(CalculationsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly facade = inject(AppStoreFacade);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    setTimeout(() => (this.disableAnimation = false));
  }

  public ngOnInit(): void {
    const baseCurrency = this.calculationsService.getBaseCurrency(this.pair.symbol, this.exchange);

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.exchange, baseCurrency);
    this.product = this.facade.product(this.exchange, this.pair.symbol);

    this.facade.buyMultiplicator.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((buyMultiplicator) => {
      this.buyMultiplicator = buyMultiplicator;
    });

    this.facade.orderDefaultTotalAmount.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((total) => {
      this.orderDefaultTotalAmount = total;
    });

    this.facade.defaultSellVolumeDivider.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((divider) => {
      this.defaultSellVolumeDivider = divider;
    });

    this.facade.defaultSellPriceMultiplicator.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((multiplicator) => {
      this.defaultSellPriceMultiplicator = multiplicator;
    });
  }

  public importAll(): void {
    this.historyService
      .importAll(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showSnackBar('history imported');
        this.facade.getAnalytics(this.exchange);
      });
  }

  public updateRecent(): void {
    this.historyService
      .updateRecent(this.exchange, this.pair.symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showSnackBar('recent history updated');
      });
  }

  public calcAverages(): void {
    this.facade.getAnalytics(this.exchange);
  }

  public updateTickerInfo(): void {
    this.facade.getTickers(this.exchange);
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
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.isOpened = false;
    }, 2000);
  }

  public sellRecent(): void {
    if (this.recent && this.defaultSellPriceMultiplicator && this.defaultSellVolumeDivider) {
      const price = this.recent.price * this.defaultSellPriceMultiplicator;
      const amount = this.recent.volume / this.defaultSellVolumeDivider;
      const order = this.getOrderFormValues('sell', price, amount);

      this.createOrder(order);
    }
  }

  public buyByMultiplicator(): void {
    if (this.ticker && this.buyMultiplicator && this.orderDefaultTotalAmount) {
      const price = this.ticker.last * (1 - this.buyMultiplicator.value);
      const amount = this.orderDefaultTotalAmount / price;
      const order = this.getOrderFormValues('buy', price, amount);

      this.createOrder(order);
    }
  }

  public toggleFishnet(): void {
    this.showFishnet = !this.showFishnet;
  }

  public cancelOrder(order: Order): void {
    this.orderingService
      .cancel(this.exchange, order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.facade.getOpenOrders(this.exchange);
        this.facade.getBalances(this.exchange);
      });
  }

  public createOrder(formValues: OrderFormValues): void {
    if (formValues.external) {
      return this.addExternalOrder(formValues);
    }

    const message = this.validateOrder(formValues);
    if (message) {
      const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
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

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private placeNewOrder(formValues: OrderFormValues): void {
    const order: NewOrder = { ...formValues, currencyPair: this.pair.symbol };
    this.orderingService
      .create(this.exchange, order)
      .pipe(
        tap({
          error: (err) => {
            let message = 'failed to create order';
            if (err.error?.message) {
              message = err.error.label ? `${err.error.label}: ${err.error?.message}` : err.error?.message;
            }

            this.snackBar.open(message, 'x', {
              // duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['warning'],
            });
          },
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isNewOrderExpanded = false;
        this.facade.getOpenOrders(this.exchange);
        this.facade.getBalances(this.exchange);
        this.facade.getRecentBuyAverages(this.exchange);
      });
  }

  private addExternalOrder(formValues: OrderFormValues): void {
    const order: NewOrder = { ...formValues, currencyPair: this.pair.symbol };
    this.orderingService
      .addExternalOrder(this.exchange, order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          this.isNewOrderExpanded = false;
          this.facade.getOpenOrders(this.exchange);
          this.facade.getBalances(this.exchange);
          this.facade.getRecentBuyAverages(this.exchange);
        }
        // (err) => {
        //   let message = 'failed to create order';
        //   if (err.error?.message) {
        //     message = err.error.label
        //       ? `${err.error.label}: ${err.error?.message}`
        //       : err.error?.message;
        //   }

        //   this.snackBar.open(message, 'x', {
        //     // duration: 3000,
        //     horizontalPosition: 'right',
        //     verticalPosition: 'top',
        //     panelClass: ['warning'],
        //   });
        // }
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

  private getOrderFormValues(side: OrderSide, price: number, amount: number): OrderFormValues {
    return {
      market: false,
      external: false,
      amount,
      price,
      side,
      total: amount * price,
    };
  }
}
