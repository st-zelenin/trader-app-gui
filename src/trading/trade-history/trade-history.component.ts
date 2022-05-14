import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import { Order, OrderRow, SelectedOrdersInfo } from '../../models';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHistoryComponent implements OnInit, OnDestroy {
  @Input() pair!: string;
  @Input() exchange!: EXCHANGE;

  @Input() selectedOrdersInfo!: SelectedOrdersInfo;
  @Output() selectedOrdersInfoChange = new EventEmitter<SelectedOrdersInfo>();

  public orders: OrderRow[] = [];
  public displayedColumns: string[] = [
    'checkbox',
    'ID',
    'update_time_ms',
    'side',
    'price',
    'amount',
    'total',
  ];
  public buyVolume = 0;
  public buyMoney = 0;
  public buyPrice = 0;
  public sellVolume = 0;
  public sellMoney = 0;
  public sellPrice = 0;

  private allOrders: OrderRow[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private readonly historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService
      .getHistory(this.exchange, this.pair)
      .pipe(
        takeUntil(this.unsubscribe$),
        map((orders) =>
          orders.map<OrderRow>((order) => ({ ...order, selected: false }))
        )
      )
      .subscribe((orders) => {
        this.allOrders = orders.filter(({ status }) => status !== 'cancelled');
        this.orders = this.allOrders;

        this.buyVolume = 0;
        this.sellVolume = 0;

        this.buyMoney = 0;
        this.sellMoney = 0;

        for (const order of this.orders) {
          this.applyDenomination(order);

          if (order.side === 'buy') {
            this.buyVolume += order.amount;
            this.buyMoney += order.amount * order.price;
          } else {
            this.sellVolume += order.amount;
            this.sellMoney += order.amount * order.price;
          }
        }

        this.buyPrice = this.buyVolume > 0 ? this.buyMoney / this.buyVolume : 0;
        this.sellPrice =
          this.sellVolume > 0 ? this.sellMoney / this.sellVolume : 0;
      });
  }

  public filterBuy() {
    this.orders = this.allOrders.filter(({ side }) => side === 'buy');
  }

  public filterSell() {
    this.orders = this.allOrders.filter(({ side }) => side === 'sell');
  }

  public removeFilter() {
    this.orders = this.allOrders;
  }

  private applyDenomination(order: Order): void {
    // 12/16/2021 - BTT denomination
    if (
      order.currencyPair === 'BTT_USDT' &&
      this.exchange === EXCHANGE.GATE_IO &&
      new Date(2021, 11, 16) > new Date(order.updateTimestamp)
    ) {
      order.price /= 1000;
      order.amount *= 1000;
    }
  }

  public toggleRowSelection(row: OrderRow) {
    row.selected = !row.selected;

    const info: SelectedOrdersInfo = this.orders.reduce(
      (res, order) => {
        if (order.selected) {
          res.amount += order.amount;
          res.total += order.amount * order.price;
          res.price = res.total / res.amount;
        }

        return res;
      },
      { amount: 0, total: 0, price: 0 }
    );

    this.selectedOrdersInfoChange.emit(info);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
