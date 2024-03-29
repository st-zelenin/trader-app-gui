import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BUY_MULTIPLICATORS } from '../../constants';
import { AppStoreFacade } from '../../store/facade';
import { SettingService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {
  public buyMultiplicatorControl = new FormControl('');
  public defaultTotalAmountControl = new FormControl('');
  public defaultSellVolumeDivider = new FormControl('');
  public defaultSellPriceMultiplicator = new FormControl('');

  public multiplicators = BUY_MULTIPLICATORS;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly facade: AppStoreFacade,
    private readonly authService: MsalService,
    private readonly settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((buyMultiplicator) => {
        if (buyMultiplicator) {
          this.buyMultiplicatorControl.patchValue(buyMultiplicator, {
            emitEvent: false,
          });
        }
      });

    this.buyMultiplicatorControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.facade.setBuyMultiplicator(value);
      });

    this.facade.orderDefaultTotalAmount
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => {
        if (total) {
          this.defaultTotalAmountControl.patchValue(total, {
            emitEvent: false,
          });
        }
      });

    this.defaultTotalAmountControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        const total = Number(value);
        if (total > 0) {
          this.facade.setOrderDefaultTotalAmount(total);
        }
      });

    this.facade.defaultSellVolumeDivider
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((divider) => {
        if (divider) {
          this.defaultSellVolumeDivider.patchValue(divider, {
            emitEvent: false,
          });
        }
      });

    this.defaultSellVolumeDivider.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        const divider = Number(value);
        if (divider > 0) {
          this.facade.setDefaultSellVolumeDivider(divider);
        }
      });

    this.facade.defaultSellPriceMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((multiplicator) => {
        if (multiplicator) {
          this.defaultSellPriceMultiplicator.patchValue(multiplicator, {
            emitEvent: false,
          });
        }
      });

    this.defaultSellPriceMultiplicator.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        const multiplicator = Number(value);
        if (multiplicator > 0) {
          this.facade.setDefaultSellPriceMultiplicator(multiplicator);
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
