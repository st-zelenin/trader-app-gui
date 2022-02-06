import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { BUY_MULTIPLICATORS, SORTING_TYPES } from '../../constants';
import { FILTERING_TYPE, OrderSide } from '../../models';
import { AppStoreFacade } from '../../store/facade';

@Component({
  selector: 'app-exchange-actions',
  templateUrl: './exchange-actions.component.html',
  styleUrls: ['./exchange-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeActionsComponent implements OnDestroy {
  @Input() currencyPairs: string[] = [];
  @Input() balance?: number = 0;
  @Input() estimated!: number;
  @Input() currencyLabel!: string;

  @Output() addCurrencyPair = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();
  @Output() filter = new EventEmitter<FILTERING_TYPE>();
  @Output() sort = new EventEmitter<SORTING_TYPES>();
  @Output() showRecent = new EventEmitter<OrderSide>();

  public multiplicators = BUY_MULTIPLICATORS;
  public filteringTypes = FILTERING_TYPE;
  public sortingTypes = SORTING_TYPES;

  public currencyPairControl = new FormControl();
  public buyMultiplicatorControl = new FormControl('');

  public filteredOptions: Observable<string[]>;

  private unsubscribe$ = new Subject<void>();

  public currentSorting: SORTING_TYPES = SORTING_TYPES.NONE;
  public currentFiltering: FILTERING_TYPE = FILTERING_TYPE.NONE;

  constructor(private readonly facade: AppStoreFacade) {
    this.filteredOptions = this.currencyPairControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((value) => this.filterPairs(value))
    );

    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((buyMultiplicator) => {
        if (buyMultiplicator) {
          this.buyMultiplicatorControl.patchValue(buyMultiplicator, {
            emitEvent: false,
          });
        }
      });

    this.buyMultiplicatorControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.facade.setBuyMultiplicator(value);
      });
  }

  public addPair() {
    if (!this.currencyPairControl.value) {
      return;
    }

    this.addCurrencyPair.emit(this.currencyPairControl.value);
    this.currencyPairControl.setValue('');
  }

  public updateSorting(sortingType: SORTING_TYPES) {
    this.currentSorting =
      this.currentSorting === sortingType ? SORTING_TYPES.NONE : sortingType;
    this.sort.emit(this.currentSorting);
  }

  public updateFiltering(filteringType: FILTERING_TYPE) {
    this.currentFiltering =
      this.currentFiltering === filteringType
        ? FILTERING_TYPE.NONE
        : filteringType;
    this.filter.emit(this.currentFiltering);
  }

  private filterPairs(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(value, this.currencyPairControl.value);

    return this.currencyPairs.filter((pair) =>
      pair.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
