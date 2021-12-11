import { Component, Input, OnInit } from '@angular/core';
import { HistoryService } from '../../history.service';
import { Order } from '../../models';

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
  styleUrls: ['./trade-history.component.scss'],
})
export class TradeHistoryComponent implements OnInit {
  @Input() pair!: string;

  public orders: Order[] = [];
  public displayedColumns: string[] = [
    'ID',
    'update_time_ms',
    'side',
    'price',
    'amount',
    'total',
    'star',
  ];
  public buyVolume = 0;
  public buyMoney = 0;
  public buyPrice = 0;
  public sellVolume = 0;
  public sellMoney = 0;
  public sellPrice = 0;

  private allOrders: Order[] = [];

  constructor(private readonly historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getHistory(this.pair).subscribe((orders) => {
      this.allOrders = orders.filter(({ status }) => status !== 'cancelled');
      this.orders = this.allOrders;

      this.buyVolume = 0;
      this.sellVolume = 0;

      this.buyMoney = 0;
      this.sellMoney = 0;

      for (const { side, amount, filled_total } of this.orders) {
        if (side === 'buy') {
          this.buyVolume += Number(amount);
          this.buyMoney += Number(filled_total);
        } else {
          this.sellVolume += Number(amount);
          this.sellMoney += Number(filled_total);
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
}
