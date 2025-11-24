import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { type BotDto, type BottomWeightedBot } from '../bots.interfaces';
import { BottomWeightedPairsComponent } from '../bottom-weighted-pairs/bottom-weighted-pairs.component';

@Component({
  selector: 'app-bottom-weighted-bot',
  imports: [MatButtonModule],
  templateUrl: './bottom-weighted-bot.component.html',
  styleUrls: ['../bot-common.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomWeightedBotComponent {
  public readonly rawBot = input.required<BotDto>();

  public readonly bot = computed<BottomWeightedBot>(() => this.rawBot() as BottomWeightedBot);

  private readonly dialog = inject(MatDialog);

  public onShowPairs(): void {
    this.dialog.open(BottomWeightedPairsComponent, {
      data: { botId: this.bot().id },
      width: '90vw',
      maxWidth: '1200px',
      autoFocus: false,
    });
  }
}
