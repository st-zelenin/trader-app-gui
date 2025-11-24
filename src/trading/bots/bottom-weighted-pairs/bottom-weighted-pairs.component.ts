import { ClipboardModule } from '@angular/cdk/clipboard';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BottomWeightedPairsDialogData, ExtendedTradingPair, TradingPair, TradingPairsResponse } from './bottom-weighted-pairs.interfaces';
import { API_HUB_URL } from '../../../constants';
import { DecimalWithAutoDigitsInfoPipe } from '../../decimal-with-auto-digits-info.pipe';

@Component({
  selector: 'app-bottom-weighted-pairs',
  imports: [
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ClipboardModule,
    DecimalWithAutoDigitsInfoPipe,
  ],
  providers: [DecimalPipe],
  templateUrl: './bottom-weighted-pairs.component.html',
  styleUrls: ['./bottom-weighted-pairs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomWeightedPairsComponent implements OnInit {
  public readonly pairs = signal<ExtendedTradingPair[]>([]);
  public readonly loading = signal(true);
  public readonly error = signal<string | undefined>(undefined);

  public readonly displayedColumns: string[] = [
    'id',
    'buyPrice',
    'quantity',
    'sellPrice',
    'buyAmount',
    'sellAmount',
    'difference',
    'buyOrderId',
  ];

  private readonly httpClient = inject(HttpClient);
  private readonly dialogRef = inject(MatDialogRef<BottomWeightedPairsComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: BottomWeightedPairsDialogData) {}

  public ngOnInit(): void {
    this.loadPairs();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  private loadPairs(): void {
    this.loading.set(true);
    this.error.set(undefined);

    const params = {
      botId: this.data.botId,
    };

    this.httpClient.get<TradingPairsResponse>(`${API_HUB_URL}/trading-pairs`, { params }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const extendedPairs = response.data.map(this.mapToExtendedTradingPair);
          this.pairs.set(extendedPairs);
        } else {
          this.pairs.set([]);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message ?? 'Failed to load pairs');
        this.loading.set(false);
        this.pairs.set([]);
      },
    });
  }

  private mapToExtendedTradingPair(pair: TradingPair): ExtendedTradingPair {
    const buyAmount = pair.buyPrice * pair.quantity;
    const sellAmount = pair.sellPrice * pair.quantity;
    const difference = sellAmount - buyAmount;

    return {
      ...pair,
      buyAmount,
      sellAmount,
      difference,
    };
  }
}
