import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PricePrecisionService {
  public getCurrenctPipePrecision(num: number | undefined): string {
    if (!num) {
      return '1.0-10';
    }

    const exponentialNumberPipePrecision = this.getExponentialNumberPipePrecision(num);
    if (exponentialNumberPipePrecision !== null) {
      return exponentialNumberPipePrecision;
    }

    if (num < 0) {
      return '1.0-10';
    }

    if (num > 100) {
      return '1.0-0';
    }

    if (num > 10) {
      return '1.0-2';
    }

    return '1.0-4';
  }

  private getExponentialNumberPipePrecision(num: number): string | null {
    const strLast = String(num);
    const eIndex = strLast.indexOf('e-');

    if (eIndex === -1) {
      return null;
    }

    const dotIndex = strLast.indexOf('.');
    const pre = eIndex - dotIndex - 1;
    const after = Number(strLast.substring(eIndex + 2));
    return `1.0-${pre + after}`;
  }
}
