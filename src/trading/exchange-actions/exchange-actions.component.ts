import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { SORTING_TYPES } from '../../constants';
import { FILTERING_TYPE, Multiplicator, OrderSide } from '../../models';
import { AppStoreFacade } from '../../store/facade';

@Component({
  selector: 'app-exchange-actions',
  templateUrl: './exchange-actions.component.html',
  styleUrls: ['./exchange-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExchangeActionsComponent implements OnInit, OnDestroy {
  @Input() currencyPairs: string[] = [];
  @Input() balance?: number = 0;
  @Input() estimated!: number;
  @Input() currencyLabel!: string;

  @Output() addCurrencyPair = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();
  @Output() filter = new EventEmitter<FILTERING_TYPE>();
  @Output() sort = new EventEmitter<SORTING_TYPES>();
  @Output() showRecent = new EventEmitter<OrderSide>();
  @Output() showSetting = new EventEmitter<void>();

  public filteringTypes = FILTERING_TYPE;
  public sortingTypes = SORTING_TYPES;
  public buyMultiplicator?: Multiplicator;
  public filteredOptions?: Observable<string[]>;

  public currencyPairControl = new FormControl();

  public currentSorting: SORTING_TYPES = SORTING_TYPES.NONE;
  public currentFiltering: FILTERING_TYPE = FILTERING_TYPE.NONE;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly facade: AppStoreFacade,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.currencyPairControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((value) => this.filterPairs(value))
    );

    this.facade.buyMultiplicator
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((buyMultiplicator) => {
        this.buyMultiplicator = buyMultiplicator;
        this.cd.markForCheck();
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
