import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EXCHANGE } from '../../constants';
import { Balance, NewOrder, Order, PairAverages, Ticker } from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { HistoryService } from '../history.service';
import { OrderingService } from '../ordering.service';

@Component({
  selector: 'app-pair-card-content',
  templateUrl: './pair-card-content.component.html',
  styleUrls: ['./pair-card-content.component.scss'],
})
export class PairCardContentComponent implements OnInit, AfterViewInit {
  @Input() pair!: string;
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;
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

  public panelOpenState = false;
  private closeTimeout?: any;
  private openTimeout?: any;

  constructor(
    private readonly orderingService: OrderingService,
    private readonly historyService: HistoryService,
    private readonly snackBar: MatSnackBar,
    private readonly facade: AppStoreFacade
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => (this.disableAnimation = false));
  }

  ngOnInit(): void {
    this.currency = this.pair.split(/_|-/)[0];

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.exchange, this.currency);
  }

  public importAll(): void {
    this.historyService
      .importAll(this.exchange, this.pair)
      .subscribe((data) => {
        this.showSnackBar('history imported');
        this.facade.getAnalytics(this.exchange);
      });
  }

  public updateRecent(): void {
    this.historyService
      .updateRecent(this.exchange, this.pair)
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
    this.orderingService.cancel(this.exchange, order).subscribe(() => {
      this.facade.getOpenOrders(this.exchange);
      this.facade.getBalances(this.exchange);
    });
  }

  public createOrder(order: NewOrder) {
    order.currencyPair = this.pair;
    this.orderingService.create(this.exchange, order).subscribe(() => {
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
}