import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
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
    CommonModule,
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
  @Input() public baseCurrencies!: string[];
  @Input() public currencyPairs: string[] = [];
  @Input() public balance?: number = 0;
  @Input() public estimated!: number;

  @Input() public baseCurrency!: string;
  @Output() public readonly baseCurrencyChange = new EventEmitter<string>();

  @Output() public readonly addCurrencyPair = new EventEmitter<string>();
  @Output() public readonly refresh = new EventEmitter<void>();
  @Output() public readonly filter = new EventEmitter<FilteringType>();
  @Output() public readonly sort = new EventEmitter<SortingTypes>();
  @Output() public readonly searchPairs = new EventEmitter<string>();
  @Output() public readonly showRecent = new EventEmitter<OrderSide>();
  @Output() public readonly showSetting = new EventEmitter<void>();

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
    this.baseCurrencyControl.setValue(this.baseCurrency);

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
    return this.currencyPairs.filter((pair) => pair.toLowerCase().includes(filterValue));
  }
}
