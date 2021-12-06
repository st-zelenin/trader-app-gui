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
    'star',
  ];
  public buy = 0;
  public sell = 0;

  constructor(private readonly historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getHistory(this.pair).subscribe((orders) => {
      this.orders = orders.filter(({ status }) => status !== 'cancelled');

      let volumeBuy = 0;
      let volumeSell = 0;

      let moneyBuy = 0;
      let moneSell = 0;

      for (const { side, amount, filled_total } of this.orders) {
        if (side === 'buy') {
          volumeBuy += Number(amount);
          moneyBuy += Number(filled_total);
        } else {
          volumeSell += Number(amount);
          moneSell += Number(filled_total);
        }
      }

      this.buy = volumeBuy > 0 ? moneyBuy / volumeBuy : 0;
      this.sell = volumeSell > 0 ? moneSell / volumeSell : 0;
    });
  }
}
