import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../history.service';
import {
  Balance,
  ExchangeStateFacade,
  NewOrder,
  Order,
  PairAverages,
  Ticker,
} from '../../../models';

@Component({
  selector: 'app-pair-card-content',
  templateUrl: './pair-card-content.component.html',
  styleUrls: ['./pair-card-content.component.scss'],
})
export class PairCardContentComponent implements OnInit, AfterViewInit {
  @Input() facade!: ExchangeStateFacade;
  @Input() pair!: string;
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
    private readonly historyService: HistoryService,
    private readonly snackBar: MatSnackBar
  ) {
    console.log('app-pair-card-content', 'constructor');
  }

  ngAfterViewInit(): void {
    setTimeout(() => (this.disableAnimation = false));
  }

  ngOnInit(): void {
    this.currency = this.pair.split('_')[0];

    this.calcAverages();
    this.updateTickerInfo();

    this.balance = this.facade.balance(this.currency);
  }

  public importAll(): void {
    this.historyService.importAll(this.pair).subscribe((data) => {
      this.showSnackBar('history imported');
    });
  }

  public updateRecent(): void {
    this.historyService.updateRecent(this.pair).subscribe((data) => {
      this.showSnackBar('recent history updated');
    });
  }

  public calcAverages(): void {
    this.facade.getAnalytics();
  }

  public updateTickerInfo() {
    this.facade.getTickers();
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  public cancelOrder(order: Order) {
    this.historyService.cancelOrder(order).subscribe(() => {
      this.facade.getOpenOrders();
      this.facade.getBalances();
    });
  }

  public createOrder(order: NewOrder) {
    order.currency_pair = this.pair;
    this.historyService.createOrder(order).subscribe(() => {
      this.isNewOrderExpanded = false;
      this.facade.getOpenOrders();
      this.facade.getBalances();
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
