import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BotItemActionsComponent } from '../bot-item-actions/bot-item-actions.component';
import { type BotDto, type ProgressiveBot, type ProgressiveBotConfig } from '../bots.interfaces';
import { ProgressivePairsComponent } from '../progressive-pairs/progressive-pairs.component';

@Component({
  selector: 'app-progressive-bot',
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatTooltipModule, BotItemActionsComponent],
  templateUrl: './progressive-bot.component.html',
  styleUrls: ['./progressive-bot.component.scss', '../bot-common.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressiveBotComponent {
  public readonly rawBot = input.required<BotDto>();
  public readonly isSaving = input<boolean>(false);

  public readonly configSaveRequested = output<Partial<ProgressiveBotConfig>>();

  public readonly isEditing = signal(false);
  public readonly editForm = signal<FormGroup | null>(null);

  public readonly bot = computed<ProgressiveBot>(() => this.rawBot() as ProgressiveBot);
  public readonly isFormValid = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  public startEdit(): void {
    this.isEditing.set(true);
    const form = this.fb.group({
      numPairs: [this.bot().config.numPairs, [Validators.required, Validators.min(1)]],
      initialPercentDelta: [this.bot().config.initialPercentDelta, [Validators.required]],
      deltaIncrement: [this.bot().config.deltaIncrement, [Validators.required]],
      amountToBuy: [this.bot().config.amountToBuy, [Validators.required, Validators.min(0)]],
      earnInBaseAsset: [this.bot().config.earnInBaseAsset],
    });
    this.editForm.set(form);
    this.isFormValid.set(form.valid);

    form.statusChanges.subscribe(() => this.isFormValid.set(form.valid));
  }

  public cancelEdit(): void {
    this.isEditing.set(false);
    this.editForm.set(null);
    this.isFormValid.set(false);
  }

  public requestSave(): void {
    const form = this.editForm();
    if (!form || form.invalid) {
      return;
    }

    const updated: Partial<ProgressiveBotConfig> = {
      numPairs: form.value.numPairs,
      initialPercentDelta: form.value.initialPercentDelta,
      deltaIncrement: form.value.deltaIncrement,
      amountToBuy: form.value.amountToBuy,
      earnInBaseAsset: form.value.earnInBaseAsset,
    };

    this.configSaveRequested.emit(updated);
  }

  public onShowPairs(): void {
    this.dialog.open(ProgressivePairsComponent, {
      data: { pairs: this.bot().pairs },
      width: '90vw',
      maxWidth: '1200px',
      autoFocus: false,
    });
  }

  public incrementNumPairs(): void {
    if (this.isSaving()) {
      return;
    }
    const newNumPairs = this.bot().config.numPairs + 1;
    this.configSaveRequested.emit({ numPairs: newNumPairs });
  }

  public decrementNumPairs(): void {
    if (this.isSaving()) {
      return;
    }
    const currentNumPairs = this.bot().config.numPairs;
    if (currentNumPairs <= 1) {
      return;
    }
    const newNumPairs = currentNumPairs - 1;
    this.configSaveRequested.emit({ numPairs: newNumPairs });
  }
}
