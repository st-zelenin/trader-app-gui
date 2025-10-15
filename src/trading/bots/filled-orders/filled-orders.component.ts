import { ClipboardModule } from '@angular/cdk/clipboard';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FilledOrder, FilledOrdersDialogData, FilledOrdersResponse, ProcessedFilledOrder } from './filled-orders.interfaces';
import { API_HUB_URL } from '../../../constants';
import { DecimalWithAutoDigitsInfoPipe } from '../../decimal-with-auto-digits-info.pipe';
import { BotOrderSide } from '../bots.interfaces';

@Component({
  selector: 'app-filled-orders',
  imports: [
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
    DecimalWithAutoDigitsInfoPipe,
  ],
  providers: [DecimalPipe],
  templateUrl: './filled-orders.component.html',
  styleUrls: ['./filled-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilledOrdersComponent implements OnInit {
  public readonly orders = signal<ProcessedFilledOrder[]>([]);
  public readonly loading = signal(true);
  public readonly error = signal<string | undefined>(undefined);
  public readonly totalOrders = signal(0);
  public readonly currentPage = signal(0);
  public readonly pageSize = 15;

  public readonly displayedColumns: string[] = ['pair', 'ID', 'date', 'amount', 'price', 'total'];
  public readonly side: BotOrderSide;

  private readonly httpClient = inject(HttpClient);
  private readonly dialogRef = inject(MatDialogRef<FilledOrdersComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilledOrdersDialogData) {
    this.side = data.side;
  }

  public ngOnInit(): void {
    this.loadOrders();
  }

  public onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.loadOrders();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.error.set(undefined);

    const params = {
      side: this.side.toUpperCase(),
      pageNum: this.currentPage() + 1,
      pageSize: this.pageSize,
    };

    this.httpClient.get<FilledOrdersResponse>(`${API_HUB_URL}/binance-bot/orders`, { params }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const processedOrders = response.data.items.map(this.processOrder);
          this.orders.set(processedOrders);
          this.totalOrders.set(response.data.total);
        } else {
          this.orders.set([]);
          this.totalOrders.set(0);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load orders');
        this.loading.set(false);
        this.orders.set([]);
        this.totalOrders.set(0);
      },
    });
  }

  private processOrder(order: FilledOrder): ProcessedFilledOrder {
    const executedQty = parseFloat(order.executedQty);
    const cummulativeQuoteQty = parseFloat(order.cummulativeQuoteQty);
    const price = executedQty > 0 ? cummulativeQuoteQty / executedQty : 0;

    return {
      symbol: order.symbol,
      orderId: order.orderId,
      updateTime: order.updateTime,
      executedQty,
      price,
      total: cummulativeQuoteQty,
      side: order.side,
    };
  }
}
