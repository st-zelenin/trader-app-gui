import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BUY_MULTIPLICATORS } from '../../constants';
import { AppStoreFacade } from '../../store/facade';
import { SettingService } from './settings.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Multiplicator } from '../../models';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

interface SettingsForm {
  buyMultiplicator: FormControl<Multiplicator | null>;
  defaultTotalAmount: FormControl<number | null>;
  defaultSellVolumeDivider: FormControl<number | null>;
  defaultSellPriceMultiplicator: FormControl<number | null>;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
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
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.buyMultiplicator.setValue(value, {
            emitEvent: false,
          });
        }
      });

    this.form.controls.buyMultiplicator.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.facade.setBuyMultiplicator(value);
        }
      });

    this.facade.orderDefaultTotalAmount
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.defaultTotalAmount.patchValue(value, {
            emitEvent: false,
          });
        }
      });

    this.form.controls.defaultTotalAmount.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.facade.setOrderDefaultTotalAmount(value);
        }
      });

    this.facade.defaultSellVolumeDivider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.defaultSellVolumeDivider.patchValue(value, {
            emitEvent: false,
          });
        }
      });

    this.form.controls.defaultSellVolumeDivider.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.facade.setDefaultSellVolumeDivider(value);
        }
      });

    this.facade.defaultSellPriceMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.defaultSellPriceMultiplicator.patchValue(value, {
            emitEvent: false,
          });
        }
      });

    this.form.controls.defaultSellPriceMultiplicator.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.facade.setDefaultSellPriceMultiplicator(value);
        }
      });
  }

  public signOut() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: '/',
    });
  }

  public doSomeTechService(): void {
    this.settingService
      .doSomeTechService()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
