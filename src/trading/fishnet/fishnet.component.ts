import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OrderFormValues, Product, Ticker } from '../../models';

interface FishnetForm {
  price: FormControl<number | null>;
  step: FormControl<number | null>;
  amount: FormControl<number | null>;
  total: FormControl<number | null>;
}

@Component({
  selector: 'app-fishnet',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatTooltipModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './fishnet.component.html',
  styleUrls: ['./fishnet.component.scss'],
})
export class FishnetComponent implements OnInit {
  public readonly ticker = input<Ticker | undefined>(undefined);

  public readonly product = input<Product | null>(null);

  public readonly create = output<OrderFormValues>();

  public readonly form = new FormGroup<FishnetForm>({
    price: new FormControl(null),
    step: new FormControl(null),
    amount: new FormControl(null),
    total: new FormControl(null),
  });

  public currentPrice = 0;
  public minQuantityText = 'min. quantity not limited';
  public minTotalText = 'min. total not limited';

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const product = this.product();
      this.setMinQuantityAndTotal(product);
    });
  }

  public ngOnInit(): void {
    this.form.controls.price.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val || !this.form.controls.amount.value) {
        return;
      }

      this.form.controls.total.setValue(val * this.form.controls.amount.value, {
        emitEvent: false,
      });
    });

    this.form.controls.amount.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val || !this.form.controls.price.value) {
        return;
      }

      this.form.controls.total.setValue(val * this.form.controls.price.value, {
        emitEvent: false,
      });
    });

    this.form.controls.total.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      if (!val || !this.form.controls.price.value) {
        return;
      }

      this.form.controls.amount.setValue(val / this.form.controls.price.value, {
        emitEvent: false,
      });
    });
  }

  public onSubmit(): void {
    console.log(this.form);

    this.create.emit({
      side: 'buy',
      price: this.form.controls.price.value,
      amount: this.form.controls.amount.value,
      total: this.form.controls.total.value,
      market: false,
      external: false,
    });

    if (this.form.controls.step.value && this.form.controls.price.value) {
      this.form.controls.price.setValue(this.form.controls.price.value - this.form.controls.step.value);
    }
  }

  public nextPrice(event: Event): void {
    event.stopPropagation();
    if (this.form.controls.step.value && this.form.controls.price.value) {
      this.form.controls.price.setValue(this.form.controls.price.value - this.form.controls.step.value);
    }
  }

  public setMinQuantity(): void {
    const minQuantity = this.product()?.minQuantity;
    if (minQuantity) {
      this.form.controls.amount.setValue(minQuantity);
    }
  }

  public setMinTotal(): void {
    const minTotal = this.product()?.minTotal;
    if (minTotal) {
      this.form.controls.total.setValue(minTotal);
    }
  }

  public setCurrentPrice(): void {
    const currentTicker = this.ticker();
    if (currentTicker) {
      this.form.controls.price.setValue(currentTicker.last);
    }
  }

  private setMinQuantityAndTotal(product: Product | null): void {
    if (product && product.minQuantity) {
      this.minQuantityText = `min. quantity = ${product.minQuantity}`;
    }

    if (product && product.minTotal) {
      this.minTotalText = `min. total = ${product.minTotal}`;
    }
  }
}
