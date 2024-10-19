import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EXCHANGE } from 'src/constants';

import { Order, OrderSide } from '../../models';
import { HistoryService } from '../history.service';

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
export class RecentOrdersComponent implements OnInit {
  public readonly LIMIT = 10;

  public orders: Order[] = [];
  public displayedColumns: string[] = ['pair', 'ID', 'update_time_ms', 'price', 'amount', 'total'];

  public readonly data: RecentOrdersData = inject(MAT_DIALOG_DATA);

  private readonly historyService = inject(HistoryService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.historyService
      .getRecentHistory(this.data.exchange, this.data.side, this.LIMIT)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
}
