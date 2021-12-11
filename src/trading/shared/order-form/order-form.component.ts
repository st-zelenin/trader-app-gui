import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Balance,
  Multiplicator,
  NewOrder,
  PairAverages,
  Ticker,
} from '../../../models';
import { SharedFacade } from '../../../store/shared';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  @Input() ticker?: Ticker;
  @Input() averages?: PairAverages;

  @Input() set balance(balance: Balance | null) {
    this.totalAmount = balance ? balance.available + balance.locked : 0;
  }

  @Output() create = new EventEmitter<NewOrder>();

  public totalAmount = 0;
  public buyMultiplicator?: Multiplicator = undefined;

  public orderForm = this.fb.group({
    side: ['buy'],
    price: ['', Validators.required],
    amount: ['', Validators.required],
    total: ['', Validators.required],
  });

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
    private readonly sharedFacade: SharedFacade
  ) {
    this.sharedFacade.buyMultiplicator.subscribe((buyMultiplicator) => {
      this.buyMultiplicator = buyMultiplicator;
    });
  }

  ngOnInit(): void {
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

      if (this.price.value && Number(this.price.value) > 0) {
        this.amount.patchValue(Number(val) / Number(this.price.value), {
          emitEvent: false,
        });
      }
    });

    this.sharedFacade.buyMultiplicator.subscribe((buyMultiplicator) => {
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
}
