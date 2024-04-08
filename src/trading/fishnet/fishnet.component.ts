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
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderFormValues, Product, Ticker } from '../../models';

@Component({
  selector: 'app-fishnet',
  templateUrl: './fishnet.component.html',
  styleUrls: ['./fishnet.component.scss'],
})
export class FishnetComponent implements OnInit, OnDestroy {
  @Input() ticker?: Ticker;

  @Input() set product(product: Product | null) {
    this.productDetails = product;

    if (product && product.minQuantity) {
      this.minQuantityText = `min. quantity = ${product.minQuantity}`;
    }

    if (product && product.minTotal) {
      this.minTotalText = `min. total = ${product.minTotal}`;
    }
  }

  @Output() create = new EventEmitter<OrderFormValues>();

  public fishnetForm: UntypedFormGroup;
  public currentPrice = 0;
  public minQuantityText = 'min. quantity not limited';
  public minTotalText = 'min. total not limited';

  private get price() {
    return this.fishnetForm.get('price')!;
  }

  public get step() {
    return this.fishnetForm.get('step')!;
  }

  private get amount() {
    return this.fishnetForm.get('amount')!;
  }

  private get total() {
    return this.fishnetForm.get('total')!;
  }

  private unsubscribe$ = new Subject<void>();
  private readonly LOCALE = 'en';
  private productDetails: Product | null = null;

  constructor(private readonly fb: UntypedFormBuilder) {
    this.fishnetForm = this.fb.group({
      price: ['', [Validators.required]],
      step: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      total: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
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

        if (this.price.value && Number(this.price.value) > 0) {
          this.amount.patchValue(Number(val) / Number(this.price.value), {
            emitEvent: false,
          });
        }
      });
  }

  public onSubmit() {
    console.log(this.fishnetForm);

    this.create.emit({
      ...this.fishnetForm.value,
      side: 'buy',
    });

    if (this.step && this.price.value) {
      this.setPriceValue(Number(this.price.value) - Number(this.step.value));
    }
  }

  public nextPrice(event: Event) {
    event.stopPropagation();
    if (this.step && this.price.value) {
      this.setPriceValue(Number(this.price.value) - Number(this.step.value));
    }
  }

  private setPriceValue(value: number) {
    this.price.setValue(
      formatNumber(value, this.LOCALE, '1.0-10').replace(',', '')
    );
  }

  public setMinQuantity() {
    if (this.productDetails?.minQuantity) {
      this.amount.setValue(this.productDetails.minQuantity);
    }
  }

  public setMinTotal() {
    if (this.productDetails?.minTotal) {
      this.total.setValue(this.productDetails.minTotal);
    }
  }

  public setCurrentPrice() {
    if (this.ticker) {
      this.setPriceValue(this.ticker.last);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
