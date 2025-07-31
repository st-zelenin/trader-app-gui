import { Injectable } from '@angular/core';

import { Average, OrderFormValues, Product } from '../../models';

@Injectable({ providedIn: 'root' })
export class OrderFormService {
  public fixTotal(
    product: Product | null,
    { price, amount, total }: OrderFormValues,
    byPrice: boolean
  ): Pick<OrderFormValues, 'price' | 'amount' | 'total'> | null {
    if (!price || !amount || !total || !product) {
      return null;
    }
    const priceMultiplier = this.getMultiplier(product.pricePrecision);
    let precisePrice = this.fixFloat(price, priceMultiplier);

    const amountMultiplier = this.getMultiplier(product.minQuantity);
    let preciseAmount = this.fixFloat(amount, amountMultiplier);

    let updatedTotal = precisePrice * preciseAmount;

    if (byPrice) {
      if (updatedTotal < total) {
        preciseAmount += product.minQuantity;
        updatedTotal = precisePrice * preciseAmount;

        while (updatedTotal > total) {
          precisePrice -= product.pricePrecision;

          updatedTotal = precisePrice * preciseAmount;
        }

        // one step back
        if (updatedTotal < total) {
          precisePrice += product.pricePrecision;
          updatedTotal = precisePrice * preciseAmount;
        }
      } else if (updatedTotal > total) {
        while (updatedTotal > total) {
          precisePrice -= product.pricePrecision;
          updatedTotal = precisePrice * preciseAmount;
        }

        // one step back
        if (updatedTotal < total) {
          precisePrice += product.pricePrecision;
          updatedTotal = precisePrice * preciseAmount;
        }
      }
    } else {
      while (updatedTotal < total) {
        preciseAmount += product.minQuantity;
        updatedTotal = precisePrice * preciseAmount;
      }
    }

    return {
      price: this.fixFloat(precisePrice, priceMultiplier),
      amount: this.fixFloat(preciseAmount, amountMultiplier),
      total: updatedTotal,
    };
  }

  public calculateRecommendedSell(buy: Average, sell: Average): Pick<OrderFormValues, 'price' | 'amount'> {
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

    return {
      price: nextSellPrice,
      amount: nextSellAmount - remainingOversoldAmount,
    };
  }

  private fixFloat(value: number, multiplier: number): number {
    return Math.round(value * multiplier + Number.EPSILON) / multiplier;
  }

  private getMultiplier(minFraction: number): number {
    const decimalPlaces = Math.abs(Math.log10(minFraction));
    return Math.pow(10, decimalPlaces);
  }
}
