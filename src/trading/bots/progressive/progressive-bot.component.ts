import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { type BotDto, type ProgressiveBot, type ProgressiveBotConfig } from '../bots.interfaces';

@Component({
  selector: 'app-progressive-bot',
  imports: [ReactiveFormsModule, MatButtonModule],
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
}
