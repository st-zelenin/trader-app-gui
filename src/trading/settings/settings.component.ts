import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MsalService } from '@azure/msal-angular';

import { SettingService } from './settings.service';
import { BUY_MULTIPLICATORS } from '../../constants';
import { Multiplicator } from '../../models';
import { AppStoreFacade } from '../../store/facade';

interface SettingsForm {
  buyMultiplicator: FormControl<Multiplicator | null>;
  defaultTotalAmount: FormControl<number | null>;
  defaultSellVolumeDivider: FormControl<number | null>;
  defaultSellPriceMultiplicator: FormControl<number | null>;
}

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatButtonModule, MatInputModule, MatDialogModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  public multiplicators = BUY_MULTIPLICATORS;

  public readonly form = new FormGroup<SettingsForm>({
    buyMultiplicator: new FormControl(null),
    defaultTotalAmount: new FormControl(null),
    defaultSellVolumeDivider: new FormControl(null),
    defaultSellPriceMultiplicator: new FormControl(null),
  });

  private readonly facade = inject(AppStoreFacade);
  private readonly authService = inject(MsalService);
  private readonly settingService = inject(SettingService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.facade.buyMultiplicator.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.form.controls.buyMultiplicator.setValue(value, {
          emitEvent: false,
        });
      }
    });

    this.form.controls.buyMultiplicator.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.facade.setBuyMultiplicator(value);
      }
    });

    this.facade.orderDefaultTotalAmount.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.form.controls.defaultTotalAmount.patchValue(value, {
          emitEvent: false,
        });
      }
    });

    this.form.controls.defaultTotalAmount.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.facade.setOrderDefaultTotalAmount(value);
      }
    });

    this.facade.defaultSellVolumeDivider.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.form.controls.defaultSellVolumeDivider.patchValue(value, {
          emitEvent: false,
        });
      }
    });

    this.form.controls.defaultSellVolumeDivider.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.facade.setDefaultSellVolumeDivider(value);
      }
    });

    this.facade.defaultSellPriceMultiplicator.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.form.controls.defaultSellPriceMultiplicator.patchValue(value, {
          emitEvent: false,
        });
      }
    });

    this.form.controls.defaultSellPriceMultiplicator.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (value) {
        this.facade.setDefaultSellPriceMultiplicator(value);
      }
    });
  }

  public signOut(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }

  public doSomeTechService(): void {
    this.settingService.doSomeTechService().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
