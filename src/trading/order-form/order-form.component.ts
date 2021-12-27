import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { EXCHANGE } from '../../constants';
import {
  Balance,
  Multiplicator,
  NewOrder,
  PairAverages,
  Ticker,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  @Input() exchange!: EXCHANGE;
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;

  @Input() set balance(balance: Balance | null) {
    this.totalAmount = balance ? balance.available + balance.locked : 0;
  }

  @Output() create = new EventEmitter<NewOrder>();

  public totalAmount = 0;
  public buyMultiplicator?: Multiplicator = undefined;
  public orderForm: FormGroup;

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

  constructor(
    private readonly fb: FormBuilder,
    private readonly facade: AppStoreFacade
  ) {
    this.facade.buyMultiplicator.subscribe((buyMultiplicator) => {
      this.buyMultiplicator = buyMultiplicator;
    });

    this.orderForm = this.fb.group({
      side: ['buy'],
      price: ['', this.requiredByMarketType],
      amount: ['', this.requiredByMarketType],
      total: ['', this.requiredByMarketType],
      market: [false, Validators.required],
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
    this.side.valueChanges.subscribe((val) => {
      this.enableDisableTotal(this.market.value, val === 'sell');
    });
    this.market.valueChanges.subscribe((val) => {
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
    this.price.valueChanges.subscribe((val) => {
      if (!val || Number(val) <= 0) {
        return;
      }

      if (this.amount.value && Number(this.amount.value) > 0) {
        this.total.patchValue(Number(val) * Number(this.amount.value), {
          emitEvent: false,
        });
      }
    });
    this.amount.valueChanges.subscribe((val) => {
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
    this.total.valueChanges.subscribe((val) => {
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

    this.facade.buyMultiplicator.subscribe((buyMultiplicator) => {
      this.buyMultiplicator = buyMultiplicator;
    });
  }

  public onSubmit() {
    this.create.emit(this.orderForm.value);

    const { side } = this.orderForm.value;
    this.orderForm.reset({ side });
  }

  public setAverageBuy() {
    if (this.averages) {
      this.price.setValue(this.averages.buy.price);
    }
  }

  public setAverageSell() {
    if (this.averages) {
      this.price.setValue(this.averages.sell.price);
    }
  }

  public setCurrentPrice() {
    if (this.ticker) {
      this.price.setValue(this.ticker.last);
    }
  }

  public increasePrice(event: Event) {
    event.stopPropagation();
    if (this.buyMultiplicator && this.price.value) {
      this.price.setValue(
        Number(this.price.value) * (1 + this.buyMultiplicator.value)
      );
    }
  }

  public decreasePrice(event: Event) {
    event.stopPropagation();
    if (this.buyMultiplicator && this.price.value) {
      this.price.setValue(
        Number(this.price.value) * (1 - this.buyMultiplicator.value)
      );
    }
  }

  public plusPercents(percents: number) {
    if (this.price) {
      this.price.setValue(Number(this.price.value) * (1 + percents / 100));
    }
  }

  public setOneThird() {
    if (this.totalAmount > 0) {
      this.amount.setValue(this.totalAmount / 3);
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
}
