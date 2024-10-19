import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs/operators';

import { EXCHANGE } from '../../constants';
import { CryptoPair, Order, OrderRow, SelectedOrdersInfo } from '../../models';
import { DecimalWithAutoDigitsInfoPipe } from '../decimal-with-auto-digits-info.pipe';
import { HistoryService } from '../history.service';

@Component({
  selector: 'app-trade-history',
  standalone: true,
  imports: [
    CommonModule,
    DecimalWithAutoDigitsInfoPipe,
    ClipboardModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeHistoryComponent implements OnInit {
  @Input() public pair!: CryptoPair;
  @Input() public exchange!: EXCHANGE;
  @Input() public selectedOrdersInfo!: SelectedOrdersInfo;

  @Output() public readonly selectedOrdersInfoChange = new EventEmitter<SelectedOrdersInfo>();
  @Output() public readonly sellForBtc = new EventEmitter<{ amount: number; price: number }>();

  public orders: OrderRow[] = [];
  public displayedColumns: string[] = ['checkbox', 'ID', 'update_time_ms', 'side', 'price', 'amount', 'total'];

  public buyVolume = 0;
  public buyMoney = 0;
  public buyPrice = 0;
  public sellVolume = 0;
  public sellMoney = 0;
  public sellPrice = 0;

  private allOrders: OrderRow[] = [];

  private readonly historyService = inject(HistoryService);
  private readonly cd = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.historyService
      .getHistory(this.exchange, this.pair.symbol)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((orders) => orders.map<OrderRow>((order) => ({ ...order, selected: false })))
      )
      .subscribe((orders) => {
        // looks like GATE bug:
        // completed market/buy orders still have 'cancelled' status
        // TODO: move this logic to BE?
        this.allOrders = orders.filter(({ status, type }) => (type === 'market' ? true : status !== 'cancelled'));
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

            minBuy = order.price < minBuy || minBuy === 0 ? order.price : minBuy;
          } else {
            this.sellVolume += order.amount;
            this.sellMoney += order.amount * order.price;
          }
        }

        this.buyPrice = this.buyVolume > 0 ? this.buyMoney / this.buyVolume : 0;
        this.sellPrice = this.sellVolume > 0 ? this.sellMoney / this.sellVolume : 0;

        this.calcBtc();

        this.cd.markForCheck();
      });
  }

  public filterBuy(): void {
    this.orders = this.allOrders.filter(({ side }) => side === 'buy');
  }

  public filterSell(): void {
    this.orders = this.allOrders.filter(({ side }) => side === 'sell');
  }

  public removeFilter(): void {
    this.orders = this.allOrders;
  }

  public toggleRowSelection(row: OrderRow): void {
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

  private calcBtc(): void {
    if (!this.orders.length || !this.pair.symbol.endsWith('_BTC')) {
      return;
    }

    const orders = [...this.orders].reverse();
    let curr: OrderRow | undefined = undefined;
    const calculations = [];

    for (const order of orders) {
      if (!curr) {
        curr = { ...order };
      } else if (curr.side !== order.side) {
        const diff: number = curr.amount - order.amount;
        console.log({ diff });

        if (diff === 0) {
          curr = undefined;
        } else if (diff > 0) {
          curr = { ...(curr as OrderRow), amount: diff };
        } else {
          curr = {
            ...(curr as OrderRow),
            amount: diff * -1,
            side: curr.side === 'sell' ? 'buy' : 'sell',
            price: order.price,
          };
        }
      } else {
        curr = {
          ...curr,
          amount: curr.amount + order.amount,
          price: curr.side === 'buy' ? Math.max(curr.price, order.price) : Math.min(curr.price, order.price),
        };
      }

      calculations.push({
        side: curr?.side,
        amount: curr?.amount,
        price: curr?.price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        src_side: order.side,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        src_amt: order.amount,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        src_price: order.price,
      });
    }

    // eslint-disable-next-line no-console
    console.table(calculations);

    if (curr && curr.side === 'buy') {
      this.sellForBtc.next({ amount: curr.amount, price: curr.price });
    }
  }

  private getDigitsInfo(minFraction: number): string {
    // - additional 1 for decimals
    // - additional 2 for integers
    const decimalPlaces = minFraction > 0 ? Math.log10(1 / (minFraction * 0.1)) : 2;
    return `1.0-${decimalPlaces}`;
  }
}
