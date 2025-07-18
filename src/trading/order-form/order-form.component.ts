import { Component, DestroyRef, OnInit, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, map, startWith } from 'rxjs/operators';

import { PriceSource } from './constants';
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

interface OrderForm {
  side: FormControl<OrderSide>;
  price: FormControl<number | null>;
  amount: FormControl<number | null>;
  total: FormControl<number | null>;
  external: FormControl<boolean>;
  market: FormControl<boolean>;
  priceSource: FormControl<PriceSource | null>;
  pricePercentage: FormControl<number>;
}

@Component({
  selector: 'app-order-form',
  imports: [
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
export class OrderFormComponent implements OnInit {
  public readonly exchange = input.required<EXCHANGE>();
  public readonly ticker = input<Ticker | undefined>(undefined);
  public readonly averages = input<PairAverages | undefined>(undefined);
  public readonly recent = input<Average | undefined>(undefined);
  public readonly buyMultiplicator = input<Multiplicator | undefined>(undefined);
  public readonly selectedOrdersInfo = input<SelectedOrdersInfo | undefined>(undefined);
  public readonly balance = input<Balance | null>(null);
  public readonly product = input<Product | null>(null);

  public readonly sellForBtc = input<{ amount: number; price: number } | undefined>(undefined);

  public readonly create = output<OrderFormValues>();

  public readonly orderForm: FormGroup<OrderForm>;
  public pricePrecision = 'precision not specified';
  public minQuantityText = 'min. quantity not limited';
  public minTotalText = 'min. total not limited';
  public priceSourceTypes = PriceSource;

  public pricePercentage: number[] = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.orderForm = new FormGroup<OrderForm>({
      side: new FormControl('buy', { nonNullable: true }),
      price: new FormControl(null, [this.requiredByMarketType]),
      amount: new FormControl(null, [this.requiredByMarketType]),
      total: new FormControl(null, [this.requiredByMarketType]),
      external: new FormControl(false, { nonNullable: true }),
      market: new FormControl(false, { nonNullable: true }),
      priceSource: new FormControl(null),
      pricePercentage: new FormControl(0, { nonNullable: true }),
    });

    effect(() => {
      if (this.orderForm.controls.priceSource.value === PriceSource.SELECTED_ORDERS) {
        this.setSelectedBuyPrice(this.selectedOrdersInfo());
        this.orderForm.controls.amount.setValue(null);
        this.orderForm.controls.total.setValue(null);
      }
    });

    effect(() => this.setProductData(this.product()));
  }

  public ngOnInit(): void {
    this.orderForm.controls.side.valueChanges
      .pipe(startWith(this.orderForm.controls.side.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        const isSell = val === 'sell';

        this.pricePercentage = isSell ? Array.from({ length: 20 }, (_, i) => i * 5) : Array.from({ length: 100 }, (_, i) => i * 5);

        this.enableDisableTotal(this.orderForm.controls.market.value, isSell);
        this.orderForm.controls.pricePercentage.setValue(isSell ? 50 : 10);
        this.orderForm.controls.priceSource.setValue(null);
      });

    this.orderForm.controls.market.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (val) {
        this.orderForm.controls.price.disable();
        this.orderForm.controls.price.setValue(null);
      } else {
        this.orderForm.controls.price.enable();
        this.orderForm.controls.total.enable();
      }

      this.enableDisableTotal(val, this.orderForm.controls.side.value === 'sell');
      this.orderForm.controls.price.updateValueAndValidity();
      this.orderForm.controls.amount.updateValueAndValidity();
      this.orderForm.controls.total.updateValueAndValidity();
    });

    this.orderForm.controls.price.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val || !this.orderForm.controls.amount.value) {
        return;
      }

      this.orderForm.controls.total.patchValue(val * this.orderForm.controls.amount.value, {
        emitEvent: false,
      });
    });

    this.orderForm.controls.amount.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val) {
        return;
      }

      if (this.orderForm.controls.market.value) {
        this.orderForm.controls.total.setValue(null);
        return;
      }

      if (this.orderForm.controls.price.value) {
        this.orderForm.controls.total.patchValue(val * this.orderForm.controls.price.value, {
          emitEvent: false,
        });
      }
    });

    this.orderForm.controls.total.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val) {
        return;
      }

      if (this.orderForm.controls.market.value) {
        this.orderForm.controls.amount.setValue(null);
        return;
      }

      if (this.orderForm.controls.price.value) {
        this.orderForm.controls.amount.patchValue(val / this.orderForm.controls.price.value, {
          emitEvent: false,
        });
      }
    });

    this.orderForm.controls.priceSource.valueChanges
      .pipe(
        filter((source) => !!source),
        map((source) => source as PriceSource),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((source: PriceSource) => {
        switch (source) {
          case PriceSource.CURRENT_PRICE:
            return this.setCurrentPrice(this.ticker());
          case PriceSource.RECENT_SELL:
            return this.setRecentBuyPrice(this.recent());
          case PriceSource.SELECTED_ORDERS:
            return this.setSelectedBuyPrice(this.selectedOrdersInfo());
          case PriceSource.AVERAGE_BUY:
            return this.setAverageBuy(this.averages());
          case PriceSource.AVERAGE_SELL:
            return this.setAverageSell(this.averages());
          default:
            this.orderForm.controls.price.setValue(null);
        }
      });
  }

  public onSubmit(): void {
    this.create.emit(this.orderForm.getRawValue());

    const { side, pricePercentage } = this.orderForm.value;
    this.orderForm.reset({ side, pricePercentage });
  }

  public increasePrice(event: Event): void {
    event.stopPropagation();
    const buyMultiplicator = this.buyMultiplicator();
    if (buyMultiplicator && this.orderForm.controls.price.value) {
      this.orderForm.controls.price.setValue(this.orderForm.controls.price.value * (1 + buyMultiplicator.value));
    }
  }

  public decreasePrice(event: Event): void {
    event.stopPropagation();
    const buyMultiplicator = this.buyMultiplicator();
    if (buyMultiplicator && this.orderForm.controls.price.value) {
      this.orderForm.controls.price.setValue(this.orderForm.controls.price.value / (1 + buyMultiplicator.value));
    }
  }

  public changePrice(event: Event, decrease: boolean): void {
    event.stopPropagation();

    if (this.orderForm.controls.pricePercentage.value && this.orderForm.controls.price.value) {
      this.orderForm.controls.price.setValue(
        this.orderForm.controls.price.value *
          (decrease ? 1 - this.orderForm.controls.pricePercentage.value / 100 : 1 + this.orderForm.controls.pricePercentage.value / 100)
      );
    }
  }

  public setOneThird(): void {
    const averages = this.averages();
    const totalAmount = (averages?.buy.volume || 0) - (averages?.sell.volume || 0);
    const selectedOrdersInfo = this.selectedOrdersInfo();

    if (totalAmount > 0) {
      if (this.orderForm.controls.priceSource.value === PriceSource.RECENT_SELL) {
        const recent = this.recent();
        if (recent) {
          this.orderForm.controls.amount.setValue(recent.volume / 3);
        }
      } else if (this.orderForm.controls.priceSource.value === PriceSource.SELECTED_ORDERS && selectedOrdersInfo) {
        const amount = selectedOrdersInfo.buy.volume - selectedOrdersInfo.sell.volume;
        if (amount > 0) {
          this.orderForm.controls.amount.setValue(amount / 3);
        }
      } else {
        this.orderForm.controls.amount.setValue(totalAmount / 3);
      }
    }
  }

  public getRecommendedPriceAndAmount(): void {
    const sellForBtc = this.sellForBtc();
    if (sellForBtc) {
      this.orderForm.patchValue({
        price: sellForBtc.price,
        amount: sellForBtc.amount,
      });

      return;
    }

    const selectedOrdersInfo = this.selectedOrdersInfo();
    if (selectedOrdersInfo && selectedOrdersInfo.buy.price) {
      if (this.orderForm.controls.side.value === 'sell') {
        return this.calculateRecommendedSell(selectedOrdersInfo.buy, selectedOrdersInfo.sell);
      }
    }

    const averages = this.averages();
    if (averages) {
      if (this.orderForm.controls.side.value === 'sell') {
        return this.calculateRecommendedSell(averages.buy, averages.sell);
      }
    }
  }

  public setMinQuantity(): void {
    const product = this.product();
    if (product?.minQuantity) {
      this.orderForm.controls.amount.setValue(product.minQuantity);
    }
  }

  public setMinTotal(): void {
    const product = this.product();
    if (product?.minTotal) {
      this.orderForm.controls.total.setValue(product.minTotal);
    }
  }

  private setProductData(product: Product | null): void {
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

  private enableDisableTotal(isMarket: boolean, isSell: boolean): void {
    if (isMarket && isSell) {
      this.orderForm.controls.total.setValue(null);
      this.orderForm.controls.total.disable();
    } else if (this.orderForm.controls.total.disabled) {
      this.orderForm.controls.total.enable();
    }
  }

  private requiredByMarketType = (control: AbstractControl): ValidationErrors | null => {
    // not initialized yet
    if (!this.orderForm) {
      return null;
    }

    // without 'buy by market' - standard required
    if (!this.orderForm.controls.market.value) {
      return Validators.required(control);
    }

    // with 'buy by market' - valid if there is 'amount' or 'total'
    if (this.orderForm.controls.amount.value || this.orderForm.controls.total.value) {
      return null;
    }

    // add standard required error
    return Validators.required(control);
  };

  private setAverageBuy(averages: PairAverages | undefined): void {
    if (averages) {
      this.orderForm.controls.price.setValue(averages.buy.price);
    }
  }

  private setAverageSell(averages: PairAverages | undefined): void {
    if (averages) {
      this.orderForm.controls.price.setValue(averages.sell.price);
    }
  }

  private setCurrentPrice(ticker: Ticker | undefined): void {
    if (ticker) {
      this.orderForm.controls.price.setValue(ticker.last);
    }
  }

  private setRecentBuyPrice(average: Average | undefined): void {
    if (average) {
      this.orderForm.controls.price.setValue(average.price);
    }
  }

  private setSelectedBuyPrice(ordersInfo: SelectedOrdersInfo | undefined): void {
    if (ordersInfo) {
      this.orderForm.controls.price.setValue(ordersInfo.buy.price);
    }
  }

  private calculateRecommendedSell(buy: Average, sell: Average): void {
    let done = false;

    let nextSellPrice = buy.price * 1.5;
    let nextSellAmount = buy.volume / 3;
    let toBeSold = nextSellAmount;
    let remainingOversoldAmount = sell.volume || 0;
    const MIN_ORDER_AMOUNT = 10;

    do {
      const rest = nextSellAmount - remainingOversoldAmount;

      if (nextSellAmount > remainingOversoldAmount && rest * nextSellPrice > MIN_ORDER_AMOUNT) {
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
        nextSellAmount = (buy.volume - toBeSold) / 3;
        toBeSold += nextSellAmount;
      }
    } while (!done);

    this.orderForm.patchValue({
      price: nextSellPrice,
      amount: nextSellAmount - remainingOversoldAmount,
    });
  }
}
