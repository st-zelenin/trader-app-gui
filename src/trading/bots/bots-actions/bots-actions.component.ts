import { Component, input, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BotFilteringType, BotSortingType } from './bots-actions.constants';
import { BotOrderSide } from '../bots.interfaces';

@Component({
  selector: 'app-bots-actions',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bots-actions.component.html',
  styleUrl: './bots-actions.component.scss',
})
export class BotsActionsComponent {
  public readonly availableBaseCurrency = input.required<number>();

  public readonly refreshBots = output<void>();
  public readonly refreshPrices = output<void>();
  public readonly filter = output<BotFilteringType>();
  public readonly sort = output<BotSortingType>();
  public readonly showFilled = output<BotOrderSide>();

  public readonly currentSorting = signal<BotSortingType>(BotSortingType.NONE);
  public readonly currentFiltering = signal<BotFilteringType>(BotFilteringType.NONE);

  public readonly filteringTypes = BotFilteringType;
  public readonly sortingTypes = BotSortingType;

  public refresh(): void {
    this.refreshBots.emit();
    this.refreshPrices.emit();
  }

  public updateSorting(sortingType: BotSortingType): void {
    const newValue = this.currentSorting() === sortingType ? BotSortingType.NONE : sortingType;
    this.currentSorting.set(newValue);
    this.sort.emit(newValue);
  }

  public updateFiltering(filteringType: BotFilteringType): void {
    const newValue = this.currentFiltering() === filteringType ? BotFilteringType.NONE : filteringType;
    this.currentFiltering.set(newValue);
    this.filter.emit(newValue);
  }
}
