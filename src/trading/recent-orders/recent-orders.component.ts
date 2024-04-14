import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { EXCHANGE } from 'src/constants';
import { Order, OrderSide } from '../../models';
import { HistoryService } from '../history.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface RecentOrdersData {
  exchange: EXCHANGE;
  side: OrderSide;
}

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule],
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

  public readonly data: RecentOrdersData = inject(MAT_DIALOG_DATA);

  private readonly historyService = inject(HistoryService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.historyService
      .getRecentHistory(this.data.exchange, this.data.side, this.LIMIT)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(() => {
          this.snackBar.open('failed to get recent orders', 'x', {
            // 1 minute
            duration: 60 * 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['warning'],
          });

          return of([]);
        })
      )
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
