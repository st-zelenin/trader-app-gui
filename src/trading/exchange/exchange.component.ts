import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE, SORTING_TYPES } from '../../constants';
import {
  Balance,
  Balances,
  FILTERING_TYPE,
  OpenOrdersByPairs,
  OrderSide,
  Tickers,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { CalculationsService } from '../calculations.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../confirmation-dialog/confirmation-dialog.component';
import { FilteringService } from '../filtering.service';
import {
  RecentOrdersComponent,
  RecentOrdersData,
} from '../recent-orders/recent-orders.component';
import { SortingService } from '../sorting.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit, OnDestroy {
  @Input() exchange!: EXCHANGE;
  @Input() baseCurrency!: string;

  @Output() updatePairs = new EventEmitter<{
    exchange: EXCHANGE;
    pairs: string[];
  }>();

  public pairs: string[] = [];
  public currencyPairs?: Observable<string[]>;
  public baseCurrencyBalance?: Observable<Balance>;
  public estimated: number = 0;

  private openOrders: OpenOrdersByPairs = {};
  private tickers: Tickers = {};
  private balances: Balances = {};
  private isSorted = false;
  private notSortedPairs: string[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly facade: AppStoreFacade,
    private readonly filteringService: FilteringService,
    private readonly sortingService: SortingService,
    private readonly calculationsService: CalculationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 15 minutes
    interval(15 * 60 * 1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.refresh());

    this.facade
      .pairs(this.exchange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pairs) => {
        this.notSortedPairs = [...pairs];

        this.pairs = this.isSorted
          ? this.sortingService.sortBySellOrder(
              [...pairs],
              this.openOrders,
              this.tickers
            )
          : [...pairs];
        this.facade.getTickers(this.exchange);
      });

    this.facade
      .openOrders(this.exchange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((openOrders) => {
        this.openOrders = openOrders;
      });

    this.facade
      .tickers(this.exchange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((tickers) => {
        this.tickers = tickers;
        this.calcEstimatedTotal();
      });

    this.facade
      .balances(this.exchange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((balances) => {
        this.balances = balances;
        this.calcEstimatedTotal();
      });

    this.facade.getProducts(this.exchange);
    this.facade.getCurrencyPairs(this.exchange);

    this.currencyPairs = this.facade.currencyPairs(this.exchange);
    this.baseCurrencyBalance = this.facade.balance(
      this.exchange,
      this.baseCurrency
    );
    this.refresh();
  }

  public addPair(currencyPair: string) {
    if (!currencyPair || this.notSortedPairs.includes(currencyPair)) {
      return;
    }

    this.notSortedPairs.push(currencyPair);
    this.updatePairs.emit({
      exchange: this.exchange,
      pairs: this.notSortedPairs,
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pairs, event.previousIndex, event.currentIndex);

    if (!this.isSorted) {
      this.updatePairs.emit({ exchange: this.exchange, pairs: this.pairs });
    }
  }

  public removePair(pair: string) {
    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialogComponent, {
      data: {
        title: 'Remove currency pair',
        message: `This will remove ${pair}. Are you sure?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const index = this.notSortedPairs.indexOf(pair);

        if (index > -1) {
          this.notSortedPairs.splice(index, 1);
          this.updatePairs.emit({
            exchange: this.exchange,
            pairs: this.notSortedPairs,
          });
        }
      }
    });
  }

  public refresh() {
    this.facade.getAnalytics(this.exchange);
    this.facade.getOpenOrders(this.exchange);
    this.facade.getTickers(this.exchange);
    this.facade.getBalances(this.exchange);
    this.facade.getRecentBuyAverages(this.exchange);
  }

  public filter(filteringType: FILTERING_TYPE) {
    this.filteringService.toggleFilter(filteringType);
  }

  public sort(sortingType: SORTING_TYPES) {
    this.isSorted = sortingType !== SORTING_TYPES.NONE;

    this.pairs = this.getSortedCards(sortingType);
  }

  private getSortedCards(sortingType: SORTING_TYPES) {
    switch (sortingType) {
      case SORTING_TYPES.NONE:
        return [...this.notSortedPairs];
      case SORTING_TYPES.UPCOMING_SELL:
        return this.sortingService.sortBySellOrder(
          [...this.notSortedPairs],
          this.openOrders,
          this.tickers
        );
      case SORTING_TYPES.ESTIMATED_TOTAL:
        return this.sortingService.sortByEstimatedTotal(
          [...this.notSortedPairs],
          this.balances,
          this.tickers,
          this.exchange
        );
      default:
        throw new Error(`unhandled sorting type: ${sortingType}`);
    }
  }

  public showRecent(side: OrderSide) {
    this.dialog.open<RecentOrdersComponent, RecentOrdersData>(
      RecentOrdersComponent,
      {
        width: '80vw',
        maxWidth: '1000px',
        data: { exchange: this.exchange, side },
      }
    );
  }

  private calcEstimatedTotal() {
    const coins = Object.keys(this.balances);
    this.estimated = coins.reduce((total, baseCurrency) => {
      const pair = this.calculationsService.getCurrencyPair(
        baseCurrency,
        this.exchange
      );

      total += this.calculationsService.calcEstimatedTotal(
        this.tickers[pair],
        this.balances[baseCurrency]
      );
      return total;
    }, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
