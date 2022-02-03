import { formatNumber } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  Multiplicator,
  OrderFormValues,
  PairAverages,
  Product,
  Ticker,
} from '../../models';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit, OnDestroy {
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;
  @Input() recent?: Average;
  @Input() buyMultiplicator?: Multiplicator = undefined;

  @Input() set balance(balance: Balance | null) {
    this.totalAmount = balance ? balance.available + balance.locked : 0;
  }

  @Input() set product(product: Product | null) {
    if (product && product.minQuantity) {
      this.minQuantity = `min. quantity = ${product.minQuantity}`;
    }

    if (product && product.minTotal) {
      this.minTotal = `min. total = ${product.minTotal}`;
    }

    if (product && product.pricePrecision) {
      this.pricePrecision = `precision = ${product.pricePrecision}`;
    }
  }

  @Output() create = new EventEmitter<OrderFormValues>();

  public totalAmount = 0;
  public orderForm: FormGroup;
  public pricePrecision = 'precision not specified';
  public minQuantity = 'min. quantity not limited';
  public minTotal = 'min. total not limited';

  public get market() {
    return this.orderForm.get('market')!;
  }

  public get side() {
    return this.orderForm.get('side')!;
  }

  private get price() {
    return this.orderForm.get('price')!;
  }

  private get amount() {
    return this.orderForm.get('amount')!;
  }

  private get total() {
    return this.orderForm.get('total')!;
  }

  private get priceSource() {
    return this.orderForm.get('priceSource')!;
  }

  private unsubscribe$ = new Subject<void>();
  private readonly LOCALE = 'en';

  constructor(private readonly fb: FormBuilder) {
    this.orderForm = this.fb.group({
      side: ['buy'],
      price: ['', this.requiredByMarketType],
      amount: ['', this.requiredByMarketType],
      total: ['', this.requiredByMarketType],
      market: [false],
      priceSource: [''],
    });
  }

  private enableDisableTotal(isMarket: boolean, isSell: boolean) {
    if (isMarket && isSell) {
      this.total.patchValue('');
      this.total.disable();
    } else if (this.total.disabled) {
      this.total.enable();
    }
  }

  ngOnInit(): void {
    this.side.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        this.enableDisableTotal(this.market.value, val === 'sell');
        this.priceSource.setValue('');
      });
    this.market.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val) {
          this.price.disable();
          this.price.patchValue('');
        } else {
          this.price.enable();
          this.total.enable();
        }

        this.enableDisableTotal(val, this.side.value === 'sell');
        this.price.updateValueAndValidity();
        this.amount.updateValueAndValidity();
        this.total.updateValueAndValidity();
      });
    this.price.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val || Number(val) <= 0) {
          return;
        }

        if (this.amount.value && Number(this.amount.value) > 0) {
          this.total.patchValue(Number(val) * Number(this.amount.value), {
            emitEvent: false,
          });
        }
      });
    this.amount.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val || Number(val) <= 0) {
          return;
        }

        if (this.market.value) {
          this.total.patchValue('');
          return;
        }

        if (this.price.value && Number(this.price.value) > 0) {
          this.total.patchValue(Number(val) * Number(this.price.value), {
            emitEvent: false,
          });
        }
      });
    this.total.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val || Number(val) <= 0) {
          return;
        }

        if (this.market.value) {
          this.amount.patchValue('');
          return;
        }

        if (this.price.value && Number(this.price.value) > 0) {
          this.amount.patchValue(Number(val) / Number(this.price.value), {
            emitEvent: false,
          });
        }
      });
    this.priceSource.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        switch (val) {
          case 'current':
            return this.setCurrentPrice();
          case 'recent':
            return this.setRecentBuyPrice();
          case 'buy':
            return this.setAverageBuy();
          case 'sell':
            return this.setAverageSell();
          default:
            this.price.setValue('');
        }
      });
  }

  public onSubmit() {
    this.create.emit(this.orderForm.value);

    const { side } = this.orderForm.value;
    this.orderForm.reset({ side });
  }

  private setAverageBuy() {
    if (this.averages) {
      this.setPriceValue(this.averages.buy.price);
    }
  }

  private setAverageSell() {
    if (this.averages) {
      this.setPriceValue(this.averages.sell.price);
    }
  }

  private setCurrentPrice() {
    if (this.ticker) {
      this.setPriceValue(this.ticker.last);
    }
  }

  private setRecentBuyPrice() {
    if (this.recent) {
      this.setPriceValue(this.recent.price);
    }
  }

  public increasePrice(event: Event) {
    event.stopPropagation();
    if (this.buyMultiplicator && this.price.value) {
      this.setPriceValue(
        Number(this.price.value) * (1 + this.buyMultiplicator.value)
      );
    }
  }

  public decreasePrice(event: Event) {
    event.stopPropagation();
    if (this.buyMultiplicator && this.price.value) {
      this.setPriceValue(
        Number(this.price.value) * (1 - this.buyMultiplicator.value)
      );
    }
  }

  public plusPercents(percents: number) {
    if (this.price) {
      this.setPriceValue(Number(this.price.value) * (1 + percents / 100));
    }
  }

  public setOneThird() {
    if (this.totalAmount > 0) {
      if (this.priceSource.value === 'recent' && this.recent) {
        this.amount.setValue(this.recent.volume / 3);
      } else {
        this.amount.setValue(this.totalAmount / 3);
      }
    }
  }

  private requiredByMarketType = (
    control: AbstractControl
  ): ValidationErrors | null => {
    // not initialized yet
    if (!this.orderForm) {
      return null;
    }

    // without 'buy by market' - standard required
    if (!this.market || !this.market.value) {
      return Validators.required(control);
    }

    // with 'buy by market' - valid if there is 'amount' or 'total'
    if (this.amount.value || this.total.value) {
      return null;
    }

    // add standard required error
    return Validators.required(control);
  };

  private setPriceValue(value: number) {
    this.price.setValue(
      formatNumber(value, this.LOCALE, '1.0-10').replace(',', '')
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
