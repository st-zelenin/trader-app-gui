import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { EXCHANGE, SORTING_TYPES } from '../../constants';
import {
  Balance,
  Balances,
  CryptoPair,
  ExchangeSymbol,
  FILTERING_TYPE,
  OpenOrdersByPairs,
  OrderedSymbols,
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
import { SettingsComponent } from '../settings/settings.component';
import { SortingService } from '../sorting.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExchangeActionsComponent } from '../exchange-actions/exchange-actions.component';
import { CommonModule } from '@angular/common';
import { PairCardComponent } from '../pair-card/pair-card.component';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DragDropModule,
    ExchangeActionsComponent,
    PairCardComponent,
  ],
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit, OnDestroy {
  @Input() exchange!: EXCHANGE;
  @Input() baseCurrencies!: string[];

  @Input() set baseCurrency(value: string) {
    this.currentBaseCurrency = value;
    this.updateBaseCurrencyRelatedData();
  }
  @Output() baseCurrencyChange = new EventEmitter<string>();

  @Output() pairAdded = new EventEmitter<ExchangeSymbol>();
  @Output() pairRemoved = new EventEmitter<ExchangeSymbol>();
  @Output() pairsOrdered = new EventEmitter<OrderedSymbols>();

  public pairs: CryptoPair[] = [];
  public currencyPairs?: Observable<string[]>;
  public quoteCurrencyBalance?: Observable<Balance>;
  public estimated: number = 0;
  public currentBaseCurrency = '';

  private openOrders: OpenOrdersByPairs = {};
  private tickers: Tickers = {};
  private balances: Balances = {};
  private sortingType = SORTING_TYPES.NONE;
  private allCurrencyPairs: CryptoPair[] = [];
  private currentBaseCurrencyPairs: CryptoPair[] = [];
  private otherCurrencyPairs: CryptoPair[] = [];
  private currencyPairsLoaded = false;

  private readonly facade = inject(AppStoreFacade);
  private readonly filteringService = inject(FilteringService);
  private readonly sortingService = inject(SortingService);
  private readonly calculationsService = inject(CalculationsService);
  private readonly dialog = inject(MatDialog);
  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    // 15 minutes
    interval(15 * 60 * 1000)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.refresh());

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

    // cache products and currency pairs
    this.facade
      .products(this.exchange)
      .pipe(
        take(1),
        tap((products) => {
          if (!products) {
            this.facade.getProducts(this.exchange);
          }
        })
      )
      .subscribe();

    this.currencyPairs = this.facade.currencyPairs(this.exchange).pipe(
      tap((pairs) => {
        if (!this.currencyPairsLoaded && (!pairs || !pairs.length)) {
          this.currencyPairsLoaded = true;
          this.facade.getCurrencyPairs(this.exchange);
        }
      })
    );

    this.refresh();
  }

  public addPair(currencyPair: string) {
    if (
      !currencyPair ||
      this.allCurrencyPairs.find(({ symbol }) => symbol === currencyPair)
    ) {
      return;
    }

    this.allCurrencyPairs.push({ symbol: currencyPair, isArchived: false });
    this.pairAdded.emit({
      exchange: this.exchange,
      symbol: currencyPair,
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pairs, event.previousIndex, event.currentIndex);

    if (this.sortingType === SORTING_TYPES.NONE) {
      this.pairsOrdered.emit({
        exchange: this.exchange,
        symbols: [
          ...this.pairs.map(({ symbol }) => symbol),
          ...this.otherCurrencyPairs.map(({ symbol }) => symbol),
        ],
      });
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
        const index = this.allCurrencyPairs.findIndex(
          ({ symbol }) => symbol === pair
        );

        if (index > -1) {
          this.allCurrencyPairs.splice(index, 1);
          this.pairRemoved.emit({
            exchange: this.exchange,
            symbol: pair,
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
    this.sortingType = sortingType;

    this.pairs = this.getSortedCards();
  }

  public search(value: string) {
    this.pairs = value
      ? this.currentBaseCurrencyPairs.filter((p) => p.symbol.includes(value))
      : [...this.currentBaseCurrencyPairs];
  }

  private getSortedCards() {
    switch (this.sortingType) {
      case SORTING_TYPES.NONE:
        return [...this.currentBaseCurrencyPairs];
      case SORTING_TYPES.UPCOMING_SELL:
        return this.sortingService.sortByupcomingOrder(
          [...this.currentBaseCurrencyPairs],
          this.openOrders,
          this.tickers,
          'sell'
        );
      case SORTING_TYPES.UPCOMING_BUY:
        return this.sortingService.sortByupcomingOrder(
          [...this.currentBaseCurrencyPairs],
          this.openOrders,
          this.tickers,
          'buy'
        );
      case SORTING_TYPES.ESTIMATED_TOTAL:
        return this.sortingService.sortByEstimatedTotal(
          [...this.currentBaseCurrencyPairs],
          this.balances,
          this.tickers,
          this.exchange
        );
      case SORTING_TYPES.MOST_CHANGE:
        return this.sortingService.sortByHighestChange(
          [...this.currentBaseCurrencyPairs],
          this.tickers
        );
      default:
        throw new Error(`unhandled sorting type: ${this.sortingType}`);
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

  public changeBaseCurrency(currency: string): void {
    this.baseCurrencyChange.emit(currency);
  }

  private updateBaseCurrencyRelatedData(): void {
    this.quoteCurrencyBalance = this.facade.balance(
      this.exchange,
      this.currentBaseCurrency
    );

    this.facade
      .pairs(this.exchange)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((pairs = []) => {
        this.allCurrencyPairs = [...pairs];

        const { current, rest } = pairs.reduce(
          (res, pair) => {
            if (pair.symbol.endsWith(this.currentBaseCurrency)) {
              res.current.push(pair);
            } else {
              res.rest.push(pair);
            }

            return res;
          },
          { current: [] as CryptoPair[], rest: [] as CryptoPair[] }
        );

        this.currentBaseCurrencyPairs = current;
        this.otherCurrencyPairs = rest;
        this.pairs = this.getSortedCards();

        this.facade.getTickers(this.exchange);
      });
  }

  public showSetting() {
    this.dialog.open<SettingsComponent>(SettingsComponent, {
      minWidth: '300px',
    });
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
