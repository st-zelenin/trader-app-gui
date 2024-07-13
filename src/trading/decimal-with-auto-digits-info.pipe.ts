import { DecimalPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalWithAutoDigitsInfo',
  standalone: true,
})
export class DecimalWithAutoDigitsInfoPipe implements PipeTransform {
  private readonly decimalPipe = inject(DecimalPipe);

  public transform(value: number | undefined): string | null {
    return this.decimalPipe.transform(
      value,
      this.getCurrenctPipePrecision(value)
    );
  }

  private getCurrenctPipePrecision(num: number | undefined): string {
    if (!num) {
      return '1.0-10';
    }

    if (num > 1) {
      return '1.0-2';
    }

    if (num > 0.1) {
      return '1.0-4';
    }

    if (num > 0.01) {
      return '1.0-5';
    }

    if (num > 0.001) {
      return '1.0-6';
    }

    return '1.0-10';
  }
}
