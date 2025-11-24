import { ClipboardModule } from '@angular/cdk/clipboard';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExtendedProgressivePair, ProgressivePairsDialogData } from './progressive-pairs.interfaces';
import { DecimalWithAutoDigitsInfoPipe } from '../../decimal-with-auto-digits-info.pipe';
import { BotPair } from '../bots.interfaces';

@Component({
  selector: 'app-progressive-pairs',
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
  templateUrl: './progressive-pairs.component.html',
  styleUrls: ['./progressive-pairs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressivePairsComponent {
  public readonly rawPairs = signal<BotPair[]>([]);
  public readonly pairs = computed<ExtendedProgressivePair[]>(() => {
    return this.rawPairs().map((pair) => {
      const buyAmount = pair.buyPrice * pair.quantity;
      const sellAmount = pair.sellPrice * pair.quantity;
      const difference = sellAmount - buyAmount;

      return {
        ...pair,
        difference,
      };
    });
  });

  public readonly displayedColumns: string[] = ['buyOrderId', 'buyPrice', 'sellOrderId', 'sellPrice', 'quantity', 'difference'];

  private readonly dialogRef = inject(MatDialogRef<ProgressivePairsComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProgressivePairsDialogData) {
    this.rawPairs.set(data.pairs);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
