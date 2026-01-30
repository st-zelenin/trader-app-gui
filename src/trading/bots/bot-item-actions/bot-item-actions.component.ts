import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BotOrderSide } from '../bots.interfaces';
import { FilledOrdersComponent } from '../filled-orders/filled-orders.component';

@Component({
  selector: 'app-bot-item-actions',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './bot-item-actions.component.html',
  styleUrls: ['./bot-item-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotItemActionsComponent {
  public readonly showEdit = input<boolean>(false);
  public readonly botId = input.required<string>();

  public readonly editClicked = output<void>();
  public readonly showPairsClicked = output<void>();

  private readonly dialog = inject(MatDialog);

  public onEdit(): void {
    this.editClicked.emit();
  }

  public onShowPairs(): void {
    this.showPairsClicked.emit();
  }

  public onShowFilled(side: BotOrderSide): void {
    this.dialog.open(FilledOrdersComponent, {
      data: { side, botId: this.botId() },
      width: '90vw',
      maxWidth: '1200px',
      autoFocus: false,
    });
  }
}
