import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type BotDto, type BottomWeightedBot } from '../bots.interfaces';

@Component({
  selector: 'app-bottom-weighted-bot',
  templateUrl: './bottom-weighted-bot.component.html',
  styleUrls: ['../bot-common.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomWeightedBotComponent {
  public readonly rawBot = input.required<BotDto>();

  public readonly bot = computed<BottomWeightedBot>(() => this.rawBot() as BottomWeightedBot);
}
