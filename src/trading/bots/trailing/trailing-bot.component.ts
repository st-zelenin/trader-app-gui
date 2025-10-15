import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type BotDto, type TrailingBot } from '../bots.interfaces';

@Component({
  selector: 'app-trailing-bot',
  templateUrl: './trailing-bot.component.html',
  styleUrls: ['../bot-common.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailingBotComponent {
  public readonly rawBot = input.required<BotDto>();

  public readonly bot = computed<TrailingBot>(() => this.rawBot() as TrailingBot);
}
