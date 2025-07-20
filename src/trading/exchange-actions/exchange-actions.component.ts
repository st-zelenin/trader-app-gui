import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { SortingTypes } from '../../constants';
import { FilteringType, OrderSide } from '../../models';
import { AppStoreFacade } from '../../store/facade';

@Component({
  selector: 'app-exchange-actions',
  imports: [
    AsyncPipe,
    DecimalPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
  ],
  templateUrl: './exchange-actions.component.html',
  styleUrls: ['./exchange-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeActionsComponent implements OnInit {
  public readonly baseCurrencies = input.required<string[]>();
  public readonly currencyPairs = input<string[]>([]);
  public readonly balance = input<number | undefined>(0);
  public readonly estimated = input.required<number>();
  public readonly baseCurrency = input.required<string>();

  public readonly baseCurrencyChange = output<string>();
  public readonly addCurrencyPair = output<string>();
  public readonly refresh = output<void>();
  public readonly filter = output<FilteringType>();
  public readonly sort = output<SortingTypes>();
  public readonly searchPairs = output<string>();
  public readonly showRecent = output<OrderSide>();
  public readonly showSetting = output<void>();

  public readonly buyMultiplicator = signal<string>('');

  public readonly filteringTypes = FilteringType;
  public readonly sortingTypes = SortingTypes;
  public filteredOptions?: Observable<string[]>;

  public readonly pairSearchControl = new FormControl<string | null>(null);
  public readonly currencyPairControl = new FormControl<string | null>(null);
  public readonly baseCurrencyControl = new FormControl<string | null>(null);

  public readonly currentSorting = signal<SortingTypes>(SortingTypes.NONE);
  public readonly currentFiltering = signal<FilteringType>(FilteringType.NONE);

  private readonly facade = inject(AppStoreFacade);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.baseCurrencyControl.setValue(this.baseCurrency());

    this.baseCurrencyControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currency) => currency && this.baseCurrencyChange.emit(currency));

    this.pairSearchControl.valueChanges.pipe(startWith(''), debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.searchPairs.emit((value || '').toUpperCase());
    });

    this.filteredOptions = this.currencyPairControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => value || ''),
      map((value) => this.filterPairs(value))
    );

    this.facade.buyMultiplicator.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((buyMultiplicator) => {
      this.buyMultiplicator.set(buyMultiplicator.text);
    });
  }

  public addPair(): void {
    if (!this.currencyPairControl.value) {
      return;
    }

    this.addCurrencyPair.emit(this.currencyPairControl.value);
    this.currencyPairControl.setValue('');
  }

  public updateSorting(sortingType: SortingTypes): void {
    const newValue = this.currentSorting() === sortingType ? SortingTypes.NONE : sortingType;
    this.currentSorting.set(newValue);
    this.sort.emit(newValue);
  }

  public updateFiltering(filteringType: FilteringType): void {
    const newValue = this.currentFiltering() === filteringType ? FilteringType.NONE : filteringType;
    this.currentFiltering.set(newValue);
    this.filter.emit(newValue);
  }

  private filterPairs(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencyPairs().filter((pair) => pair.toLowerCase().includes(filterValue));
  }
}
