import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
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
import { FilteringType, Multiplicator, OrderSide } from '../../models';
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
  public baseCurrencies = input.required<string[]>();
  public currencyPairs = input<string[]>([]);
  public balance = input<number | undefined>(0);
  public estimated = input.required<number>();
  public baseCurrency = input.required<string>();

  public readonly baseCurrencyChange = output<string>();
  public readonly addCurrencyPair = output<string>();
  public readonly refresh = output<void>();
  public readonly filter = output<FilteringType>();
  public readonly sort = output<SortingTypes>();
  public readonly searchPairs = output<string>();
  public readonly showRecent = output<OrderSide>();
  public readonly showSetting = output<void>();

  public filteringTypes = FilteringType;
  public sortingTypes = SortingTypes;
  public buyMultiplicator?: Multiplicator;
  public filteredOptions?: Observable<string[]>;

  public pairSearchControl = new FormControl<string | null>(null);
  public currencyPairControl = new FormControl<string | null>(null);
  public baseCurrencyControl = new FormControl<string | null>(null);

  public currentSorting: SortingTypes = SortingTypes.NONE;
  public currentFiltering: FilteringType = FilteringType.NONE;

  private readonly facade = inject(AppStoreFacade);
  private readonly cd = inject(ChangeDetectorRef);
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
      this.buyMultiplicator = buyMultiplicator;
      this.cd.markForCheck();
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
    this.currentSorting = this.currentSorting === sortingType ? SortingTypes.NONE : sortingType;
    this.sort.emit(this.currentSorting);
  }

  public updateFiltering(filteringType: FilteringType): void {
    this.currentFiltering = this.currentFiltering === filteringType ? FilteringType.NONE : filteringType;
    this.filter.emit(this.currentFiltering);
  }

  private filterPairs(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencyPairs().filter((pair) => pair.toLowerCase().includes(filterValue));
  }
}
