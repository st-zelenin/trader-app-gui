import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE } from 'src/constants';
import { Order, OrderSide } from '../../models';
import { HistoryService } from '../history.service';

export interface RecentOrdersData {
  exchange: EXCHANGE;
  side: OrderSide;
}

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss'],
})
export class RecentOrdersComponent implements OnInit, OnDestroy {
  public readonly LIMIT = 10;

  public orders: Order[] = [];
  public displayedColumns: string[] = [
    'pair',
    'ID',
    'update_time_ms',
    'price',
    'amount',
    'total',
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RecentOrdersData,
    private readonly historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.historyService
      .getRecentHistory(this.data.exchange, this.data.side, this.LIMIT)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
