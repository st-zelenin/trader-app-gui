import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppStoreFacade } from '../../store/facade';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public defaultTotalAmountControl = new FormControl('');
  public defaultSellVolumeDivider = new FormControl('');
  public defaultSellPriceMultiplicator = new FormControl('');

  private unsubscribe$ = new Subject<void>();

  constructor(private readonly facade: AppStoreFacade) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
