import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OrderFormValues, OrderSide, Ticker } from '../../models';
import { OrderingService } from '../ordering.service';

@Injectable({
  providedIn: 'root',
})
export class PairCardContentService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly orderingService = inject(OrderingService);

  public validateOrder(formValues: OrderFormValues, ticker: Ticker | undefined): string {
    if (formValues.side === 'sell' && ticker) {
      const price = Number(formValues.price);
      if (price < ticker.last) {
        return `Current price ${ticker.last} is heigher than order SELL price ${price}. Are you shure?`;
      }
    }

    if (formValues.side === 'buy' && ticker) {
      const price = Number(formValues.price);
      if (price > ticker.last) {
        return `Current price ${ticker.last} is less than order BUY price ${price}. Are you shure?`;
      }
    }

    return '';
  }

  public getOrderFormValues(side: OrderSide, price: number, amount: number): OrderFormValues {
    return {
      market: false,
      external: false,
      amount,
      price,
      side,
      total: amount * price,
    };
  }

  public showSuccess(message: string): void {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  public showError(message: string): void {
    this.snackBar.open(message, 'x', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['warning'],
    });
  }
}
