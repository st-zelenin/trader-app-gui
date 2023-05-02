import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  CryptoPair,
  Order,
  OrderRow,
  Product,
  SelectedOrdersInfo,
} from '../../models';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHistoryComponent implements OnInit, OnDestroy {
  @Input() pair!: CryptoPair;
  @Input() exchange!: EXCHANGE;

  @Input() selectedOrdersInfo!: SelectedOrdersInfo;
  @Output() selectedOrdersInfoChange = new EventEmitter<SelectedOrdersInfo>();

  @Input() set product(product: Product | null) {
    if (product) {
      this.priceDigitsInfo = this.getDigitsInfo(product.pricePrecision);

      const decimalPlaces =
        String(product.minQuantity).split('.')[1]?.length || 0;
      this.amountDigitsInfo = this.getDigitsInfo(
        1 / Math.pow(10, decimalPlaces)
      );
    }
  }

  public priceDigitsInfo = '1.0-10';
  public amountDigitsInfo = '1.0-10';

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

  constructor(
    private readonly historyService: HistoryService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.historyService
      .getHistory(this.exchange, this.pair.symbol)
      .pipe(
        takeUntil(this.unsubscribe$),
        map((orders) =>
          orders.map<OrderRow>((order) => ({ ...order, selected: false }))
        )
      )
      .subscribe((orders) => {
        // looks like GATE bug:
        // completed market/buy orders still have 'cancelled' status
        // TODO: move this logic to BE?
        this.allOrders = orders.filter(({ status, type }) =>
          type === 'market' ? true : status !== 'cancelled'
        );
        this.orders = this.allOrders;

        this.buyVolume = 0;
        this.sellVolume = 0;

        this.buyMoney = 0;
        this.sellMoney = 0;

        let minBuy = 0;

        for (const order of this.orders) {
          this.applyDenomination(order);

          if (order.side === 'buy') {
            this.buyVolume += order.amount;
            this.buyMoney += order.amount * order.price;

            minBuy =
              order.price < minBuy || minBuy === 0 ? order.price : minBuy;
          } else {
            this.sellVolume += order.amount;
            this.sellMoney += order.amount * order.price;
          }
        }

        this.buyPrice = this.buyVolume > 0 ? this.buyMoney / this.buyVolume : 0;
        this.sellPrice =
          this.sellVolume > 0 ? this.sellMoney / this.sellVolume : 0;

        this.calc(minBuy);

        this.cd.markForCheck();
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

  private calc(b1: number) {
    const n = 7;
    const q = 0.9; // 2 / 3;
    const sum = this.buyVolume;

    const v1 = (sum * (q - 1)) / (Math.pow(q, n) - 1);
    const total = this.buyMoney / n;

    const res = Array(n)
      .fill(undefined)
      .map((_, i) => {
        const volume = v1 * Math.pow(q, i);
        const price = total / volume;

        return { amount: volume, price, total: volume * price };
      });

    // console.table(res);
    // console.table({
    //   volume: this.buyVolume,
    //   money: this.buyMoney,
    //   v1,
    //   volumeCheck: res.reduce((aggr, { amount }) => aggr + amount, 0),
    //   moneyCheck: res.reduce((aggr, { total }) => aggr + total, 0),
    // });
  }

  private getDigitsInfo(minFraction: number): string {
    // - additional 1 for decimals
    // - additional 2 for integers
    const decimalPlaces =
      minFraction > 0 ? Math.log10(1 / (minFraction * 0.1)) : 2;
    return `1.0-${decimalPlaces}`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
