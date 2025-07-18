import { ClipboardModule } from '@angular/cdk/clipboard';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, tap } from 'rxjs';

import { PairCardContentService } from './pair-card-content.service';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  CryptoPair,
  Multiplicator,
  NewOrder,
  Order,
  OrderFormValues,
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
  imports: [
    AsyncPipe,
    DatePipe,
    DecimalPipe,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PairCardContentComponent implements OnInit, AfterViewInit {
  public readonly pair = input.required<CryptoPair>();
  public readonly exchange = input.required<EXCHANGE>();
  public readonly ticker = input<Ticker | undefined>();
  public readonly averages = input<PairAverages | undefined>();
  public readonly recent = input<Average | undefined>();
  public readonly openOrders = input<Order[]>([]);
  public readonly isExpanded = input.required<boolean>();

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

  public selectedOrdersInfo: SelectedOrdersInfo = { buy: { money: 0, volume: 0, price: 0 }, sell: { money: 0, volume: 0, price: 0 } };

  public isOpened = false;
  private closeTimeout?: any;
  private openTimeout?: any;

  private readonly orderingService = inject(OrderingService);
  private readonly historyService = inject(HistoryService);
  private readonly calculationsService = inject(CalculationsService);

  private readonly facade = inject(AppStoreFacade);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pairCardContentService = inject(PairCardContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  public ngAfterViewInit(): void {
    setTimeout(() => (this.disableAnimation = false));
  }

  public ngOnInit(): void {
    const baseCurrency = this.calculationsService.getBaseCurrency(this.pair().symbol, this.exchange());

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.exchange(), baseCurrency);
    this.product = this.facade.product(this.exchange(), this.pair().symbol);

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
      .importAll(this.exchange(), this.pair().symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pairCardContentService.showSuccess('history imported');
        this.facade.getAnalytics(this.exchange());
      });
  }

  public updateRecent(): void {
    this.historyService
      .updateRecent(this.exchange(), this.pair().symbol)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pairCardContentService.showSuccess('recent history updated');
      });
  }

  public calcAverages(): void {
    this.facade.getAnalytics(this.exchange());
  }

  public updateTickerInfo(): void {
    this.facade.getTickers(this.exchange());
  }

  public onPanelOpen(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }

    this.openTimeout = setTimeout(() => {
      this.isOpened = true;
      this.cdr.detectChanges();
    }, 0);
  }

  public onPanelClose(): void {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = undefined;
    }

    this.closeTimeout = setTimeout(() => {
      this.isOpened = false;
      this.cdr.detectChanges();
    }, 2000);
  }

  public sellRecent(): void {
    const recent = this.recent();
    if (recent && this.defaultSellPriceMultiplicator && this.defaultSellVolumeDivider) {
      const price = recent.price * this.defaultSellPriceMultiplicator;
      const amount = recent.volume / this.defaultSellVolumeDivider;
      const order = this.pairCardContentService.getOrderFormValues('sell', price, amount);

      this.createOrder(order);
    }
  }

  public buyByMultiplicator(): void {
    const ticker = this.ticker();
    if (ticker && this.buyMultiplicator && this.orderDefaultTotalAmount) {
      const price = ticker.last * (1 - this.buyMultiplicator.value);
      const amount = this.orderDefaultTotalAmount / price;
      const order = this.pairCardContentService.getOrderFormValues('buy', price, amount);

      this.createOrder(order);
    }
  }

  public toggleFishnet(): void {
    this.showFishnet = !this.showFishnet;
  }

  public cancelOrder(order: Order): void {
    this.orderingService
      .cancel(this.exchange(), order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.facade.getOpenOrders(this.exchange());
        this.facade.getBalances(this.exchange());
      });
  }

  public createOrder(formValues: OrderFormValues): void {
    if (formValues.external) {
      return this.addExternalOrder(formValues, this.exchange());
    }

    const message = this.pairCardContentService.validateOrder(formValues, this.ticker());
    if (message) {
      const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
        data: { title: 'Achtung!', message },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.placeNewOrder(formValues, this.exchange());
        }
      });
    } else {
      this.placeNewOrder(formValues, this.exchange());
    }
  }

  private placeNewOrder(formValues: OrderFormValues, exchange: EXCHANGE): void {
    const order: NewOrder = { ...formValues, currencyPair: this.pair().symbol };
    this.orderingService
      .create(exchange, order)
      .pipe(
        tap({
          error: (err) => {
            let message = 'failed to create order';
            if (err.error?.message) {
              message = err.error.label ? `${err.error.label}: ${err.error?.message}` : err.error?.message;
            }

            this.pairCardContentService.showError(message);
          },
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isNewOrderExpanded = false;
        this.facade.getOpenOrders(exchange);
        this.facade.getBalances(exchange);
        this.facade.getRecentBuyAverages(exchange);
      });
  }

  private addExternalOrder(formValues: OrderFormValues, exchange: EXCHANGE): void {
    const order: NewOrder = { ...formValues, currencyPair: this.pair().symbol };
    this.orderingService
      .addExternalOrder(exchange, order)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isNewOrderExpanded = false;
        this.facade.getOpenOrders(exchange);
        this.facade.getBalances(exchange);
        this.facade.getRecentBuyAverages(exchange);
      });
  }
}
