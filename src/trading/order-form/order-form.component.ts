import { CommonModule } from '@angular/common';
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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { EXCHANGE } from '../../constants';
import {
  Average,
  Balance,
  Multiplicator,
  OrderFormValues,
  OrderSide,
  PairAverages,
  Product,
  SelectedOrdersInfo,
  Ticker,
} from '../../models';
import { PRICE_SOURCE } from './constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

interface OrderForm {
  side: FormControl<OrderSide>;
  price: FormControl<number | null>;
  amount: FormControl<number | null>;
  total: FormControl<number | null>;
  market: FormControl<boolean>;
  priceSource: FormControl<PRICE_SOURCE | null>;
  pricePercentage: FormControl<number>;
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit, OnDestroy {
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;
  @Input() recent?: Average;
  @Input() buyMultiplicator?: Multiplicator = undefined;

  @Input() set selectedOrdersInfo(value: SelectedOrdersInfo) {
    this.selectedInfo = value;

    if (
      this.orderForm.controls.priceSource.value === PRICE_SOURCE.SELECTED_ORDERS
    ) {
      this.setSelectedBuyPrice();
      this.orderForm.controls.amount.setValue(null);
      this.orderForm.controls.total.setValue(null);
    }
  }

  @Input() set balance(balance: Balance | null) {
    this.totalAmount = balance ? balance.available + balance.locked : 0;
  }

  @Input() set product(product: Product | null) {
    this.productDetails = product;

    if (product && product.minQuantity) {
      this.minQuantityText = `min. quantity = ${product.minQuantity}`;
    }

    if (product && product.minTotal) {
      this.minTotalText = `min. total = ${product.minTotal}`;
    }

    if (product && product.pricePrecision) {
      this.pricePrecision = `precision = ${product.pricePrecision}`;
    }
  }

  @Input() sellForBtc?: { amount: number; price: number };

  @Output() public readonly create = new EventEmitter<OrderFormValues>();

  public totalAmount = 0;
  public readonly orderForm: FormGroup<OrderForm>;
  public pricePrecision = 'precision not specified';
  public minQuantityText = 'min. quantity not limited';
  public minTotalText = 'min. total not limited';
  public selectedInfo?: SelectedOrdersInfo;
  public priceSourceTypes = PRICE_SOURCE;

  public readonly pricePercentage = Array.from(
    { length: 100 },
    (_, i) => (i + 1) * 5
  );

  private readonly unsubscribe$ = new Subject<void>();
  private productDetails: Product | null = null;

  constructor() {
    this.orderForm = new FormGroup<OrderForm>({
      side: new FormControl('buy', { nonNullable: true }),
      price: new FormControl(null, [this.requiredByMarketType]),
      amount: new FormControl(null, [this.requiredByMarketType]),
      total: new FormControl(null, [this.requiredByMarketType]),
      market: new FormControl(false, { nonNullable: true }),
      priceSource: new FormControl(null),
      pricePercentage: new FormControl(50, { nonNullable: true }),
    });
  }

  private enableDisableTotal(isMarket: boolean, isSell: boolean) {
    if (isMarket && isSell) {
      this.orderForm.controls.total.setValue(null);
      this.orderForm.controls.total.disable();
    } else if (this.orderForm.controls.total.disabled) {
      this.orderForm.controls.total.enable();
    }
  }

  ngOnInit(): void {
    this.orderForm.controls.side.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        this.enableDisableTotal(
          this.orderForm.controls.market.value,
          val === 'sell'
        );
        this.orderForm.controls.priceSource.setValue(null);
      });
    this.orderForm.controls.market.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (val) {
          this.orderForm.controls.price.disable();
          this.orderForm.controls.price.setValue(null);
        } else {
          this.orderForm.controls.price.enable();
          this.orderForm.controls.total.enable();
        }

        this.enableDisableTotal(
          val,
          this.orderForm.controls.side.value === 'sell'
        );
        this.orderForm.controls.price.updateValueAndValidity();
        this.orderForm.controls.amount.updateValueAndValidity();
        this.orderForm.controls.total.updateValueAndValidity();
      });
    this.orderForm.controls.price.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val || !this.orderForm.controls.amount.value) {
          return;
        }

        this.orderForm.controls.total.patchValue(
          val * this.orderForm.controls.amount.value,
          {
            emitEvent: false,
          }
        );
      });

    this.orderForm.controls.amount.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val) {
          return;
        }

        if (this.orderForm.controls.market.value) {
          this.orderForm.controls.total.setValue(null);
          return;
        }

        if (this.orderForm.controls.price.value) {
          this.orderForm.controls.total.patchValue(
            val * this.orderForm.controls.price.value,
            {
              emitEvent: false,
            }
          );
        }
      });

    this.orderForm.controls.total.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((val) => {
        if (!val) {
          return;
        }

        if (this.orderForm.controls.market.value) {
          this.orderForm.controls.amount.setValue(null);
          return;
        }

        if (this.orderForm.controls.price.value) {
          this.orderForm.controls.amount.patchValue(
            val / this.orderForm.controls.price.value,
            {
              emitEvent: false,
            }
          );
        }
      });

    this.orderForm.controls.priceSource.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((source) => !!source),
        map((source) => source as PRICE_SOURCE)
      )
      .subscribe((source: PRICE_SOURCE) => {
        switch (source) {
          case PRICE_SOURCE.CURRENT_PRICE:
            return this.setCurrentPrice();
          case PRICE_SOURCE.RECENT_SELL:
            return this.setRecentBuyPrice();
          case PRICE_SOURCE.SELECTED_ORDERS:
            return this.setSelectedBuyPrice();
          case PRICE_SOURCE.AVERAGE_BUY:
            return this.setAverageBuy();
          case PRICE_SOURCE.AVERAGE_SELL:
            return this.setAverageSell();
          default:
            this.orderForm.controls.price.setValue(null);
        }
      });
  }

  public onSubmit() {
    this.create.emit(this.orderForm.getRawValue());

    const { side } = this.orderForm.value;
    this.orderForm.reset({ side });
  }

  private setAverageBuy() {
    if (this.averages) {
      this.orderForm.controls.price.setValue(this.averages.buy.price);
    }
  }

  private setAverageSell() {
    if (this.averages) {
      this.orderForm.controls.price.setValue(this.averages.sell.price);
    }
  }

  private setCurrentPrice() {
    if (this.ticker) {
      this.orderForm.controls.price.setValue(this.ticker.last);
    }
  }

  private setRecentBuyPrice() {
    if (this.recent) {
      this.orderForm.controls.price.setValue(this.recent.price);
    }
  }

  private setSelectedBuyPrice() {
    if (this.selectedInfo) {
      this.orderForm.controls.price.setValue(this.selectedInfo.price);
    }
  }

  public increasePrice(event: Event) {
    event.stopPropagation();
    if (this.buyMultiplicator && this.orderForm.controls.price.value) {
      this.orderForm.controls.price.setValue(
        this.orderForm.controls.price.value * (1 + this.buyMultiplicator.value)
      );
    }
  }

  public decreasePrice(event: Event) {
    event.stopPropagation();

    if (this.buyMultiplicator && this.orderForm.controls.price.value) {
      this.orderForm.controls.price.setValue(
        this.orderForm.controls.price.value / (1 + this.buyMultiplicator.value)
      );
    }
  }

  public plusPercents(event: Event) {
    event.stopPropagation();

    if (
      this.orderForm.controls.pricePercentage.value &&
      this.orderForm.controls.price.value
    ) {
      this.orderForm.controls.price.setValue(
        this.orderForm.controls.price.value *
          (1 + this.orderForm.controls.pricePercentage.value / 100)
      );
    }
  }

  public setOneThird() {
    if (this.totalAmount > 0) {
      if (
        this.orderForm.controls.priceSource.value ===
          PRICE_SOURCE.RECENT_SELL &&
        this.recent
      ) {
        this.orderForm.controls.amount.setValue(this.recent.volume / 3);
      } else if (
        this.orderForm.controls.priceSource.value ===
          PRICE_SOURCE.SELECTED_ORDERS &&
        this.selectedInfo
      ) {
        this.orderForm.controls.amount.setValue(this.selectedInfo.amount / 3);
      } else {
        this.orderForm.controls.amount.setValue(this.totalAmount / 3);
      }
    }
  }

  public getRecommendedPriceAndAmount() {
    if (this.sellForBtc) {
      this.orderForm.patchValue({
        price: this.sellForBtc.price,
        amount: this.sellForBtc.amount,
      });

      return;
    }

    console.log(this.averages);
    if (!this.averages) {
      return;
    }

    if (this.orderForm.controls.side.value === 'sell') {
      let done = false;

      let nextSellPrice = this.averages.buy.price * 1.5;
      let nextSellAmount = this.averages.buy.volume / 3;
      let toBeSold = nextSellAmount;
      let remainingOversoldAmount = this.averages.sell.volume || 0;
      const MIN_ORDER_AMOUNT = 4;

      do {
        const rest = nextSellAmount - remainingOversoldAmount;

        if (
          nextSellAmount > remainingOversoldAmount &&
          rest * nextSellPrice > MIN_ORDER_AMOUNT
        ) {
          done = true;
          console.log('sell:', {
            price: nextSellPrice,
            amount: nextSellAmount,
            remainingOversoldAmount,
            rest,
          });
        } else {
          console.log('skipped:', {
            price: nextSellPrice,
            amount: nextSellAmount,
            remainingOversoldAmount,
          });

          remainingOversoldAmount -= nextSellAmount;
          nextSellPrice *= 1.5;
          nextSellAmount = (this.averages.buy.volume - toBeSold) / 3;
          toBeSold += nextSellAmount;
        }
      } while (!done);

      this.orderForm.patchValue({
        price: nextSellPrice,
        amount: nextSellAmount - remainingOversoldAmount,
      });
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
    if (!this.orderForm.controls.market.value) {
      return Validators.required(control);
    }

    // with 'buy by market' - valid if there is 'amount' or 'total'
    if (
      this.orderForm.controls.amount.value ||
      this.orderForm.controls.total.value
    ) {
      return null;
    }

    // add standard required error
    return Validators.required(control);
  };

  public setMinQuantity() {
    if (this.productDetails?.minQuantity) {
      this.orderForm.controls.amount.setValue(this.productDetails.minQuantity);
    }
  }

  public setMinTotal() {
    if (this.productDetails?.minTotal) {
      this.orderForm.controls.total.setValue(this.productDetails.minTotal);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
