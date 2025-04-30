import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, interval } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { EXCHANGE, SortingTypes } from '../../constants';
import {
  Balance,
  Balances,
  CryptoPair,
  ExchangeSymbol,
  FilteringType,
  OpenOrdersByPairs,
  OrderSide,
  OrderedSymbols,
  Tickers,
} from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { CalculationsService } from '../calculations.service';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../confirmation-dialog/confirmation-dialog.component';
import { ExchangeActionsComponent } from '../exchange-actions/exchange-actions.component';
import { FilteringService } from '../filtering.service';
import { PairCardComponent } from '../pair-card/pair-card.component';
import { RecentOrdersComponent, RecentOrdersData } from '../recent-orders/recent-orders.component';
import { SettingsComponent } from '../settings/settings.component';
import { SortingService } from '../sorting.service';

@Component({
  selector: 'app-exchange',
  imports: [CommonModule, MatDialogModule, DragDropModule, ExchangeActionsComponent, PairCardComponent],
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  @Input() public exchange!: EXCHANGE;
  @Input() public baseCurrencies!: string[];

  @Input() public set baseCurrency(value: string) {
    this.currentBaseCurrency = value;
    this.updateBaseCurrencyRelatedData();
  }
  @Output() public readonly baseCurrencyChange = new EventEmitter<string>();

  @Output() public readonly pairAdded = new EventEmitter<ExchangeSymbol>();
  @Output() public readonly pairRemoved = new EventEmitter<ExchangeSymbol>();
  @Output() public readonly pairsOrdered = new EventEmitter<OrderedSymbols>();

  public pairs: CryptoPair[] = [];
  public currencyPairs?: Observable<string[]>;
  public quoteCurrencyBalance?: Observable<Balance>;
  public estimated: number = 0;
  public currentBaseCurrency = '';

  private openOrders: OpenOrdersByPairs = {};
  private tickers: Tickers = {};
  private balances: Balances = {};
  private sortingType = SortingTypes.NONE;
  private allCurrencyPairs: CryptoPair[] = [];
  private currentBaseCurrencyPairs: CryptoPair[] = [];
  private otherCurrencyPairs: CryptoPair[] = [];
  private currencyPairsLoaded = false;

  private readonly facade = inject(AppStoreFacade);
  private readonly filteringService = inject(FilteringService);
  private readonly sortingService = inject(SortingService);
  private readonly calculationsService = inject(CalculationsService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    // 15 minutes
    interval(15 * 60 * 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh());

    this.facade
      .openOrders(this.exchange)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((openOrders) => {
        this.openOrders = openOrders;
      });

    this.facade
      .tickers(this.exchange)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tickers) => {
        this.tickers = tickers;
        this.calcEstimatedTotal();
      });

    this.facade
      .balances(this.exchange)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  public addPair(currencyPair: string): void {
    if (!currencyPair || this.allCurrencyPairs.find(({ symbol }) => symbol === currencyPair)) {
      return;
    }

    this.allCurrencyPairs.push({ symbol: currencyPair, isArchived: false });
    this.pairAdded.emit({
      exchange: this.exchange,
      symbol: currencyPair,
    });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.pairs, event.previousIndex, event.currentIndex);

    if (this.sortingType === SortingTypes.NONE) {
      this.pairsOrdered.emit({
        exchange: this.exchange,
        symbols: [...this.pairs.map(({ symbol }) => symbol), ...this.otherCurrencyPairs.map(({ symbol }) => symbol)],
      });
    }
  }

  public removePair(pair: string): void {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData, boolean>(ConfirmationDialogComponent, {
      data: {
        title: 'Remove currency pair',
        message: `This will remove ${pair}. Are you sure?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const index = this.allCurrencyPairs.findIndex(({ symbol }) => symbol === pair);

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

  public refresh(): void {
    this.facade.getAnalytics(this.exchange);
    this.facade.getOpenOrders(this.exchange);
    this.facade.getTickers(this.exchange);
    this.facade.getBalances(this.exchange);
    this.facade.getRecentBuyAverages(this.exchange);
  }

  public filter(filteringType: FilteringType): void {
    this.filteringService.toggleFilter(filteringType);
  }

  public sort(sortingType: SortingTypes): void {
    this.sortingType = sortingType;

    this.pairs = this.getSortedCards();
  }

  public search(value: string): void {
    this.pairs = value ? this.currentBaseCurrencyPairs.filter((p) => p.symbol.includes(value)) : [...this.currentBaseCurrencyPairs];
  }

  public showRecent(side: OrderSide): void {
    this.dialog.open<RecentOrdersComponent, RecentOrdersData>(RecentOrdersComponent, {
      width: '80vw',
      maxWidth: '1000px',
      data: { exchange: this.exchange, side },
    });
  }

  public changeBaseCurrency(currency: string): void {
    this.baseCurrencyChange.emit(currency);
  }

  public showSetting(): void {
    this.dialog.open<SettingsComponent>(SettingsComponent, {
      minWidth: '300px',
    });
  }

  private calcEstimatedTotal(): void {
    const coins = Object.keys(this.balances);
    this.estimated = coins.reduce((total, baseCurrency) => {
      const pair = this.calculationsService.getCurrencyPair(baseCurrency, this.exchange);

      total += this.calculationsService.calcEstimatedTotal(this.tickers[pair], this.balances[baseCurrency]);
      return total;
    }, 0);
  }

  private updateBaseCurrencyRelatedData(): void {
    this.quoteCurrencyBalance = this.facade.balance(this.exchange, this.currentBaseCurrency);

    this.facade
      .pairs(this.exchange)
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  private getSortedCards(): CryptoPair[] {
    switch (this.sortingType) {
      case SortingTypes.NONE:
        return [...this.currentBaseCurrencyPairs];
      case SortingTypes.UPCOMING_SELL:
        return this.sortingService.sortByupcomingOrder([...this.currentBaseCurrencyPairs], this.openOrders, this.tickers, 'sell');
      case SortingTypes.UPCOMING_BUY:
        return this.sortingService.sortByupcomingOrder([...this.currentBaseCurrencyPairs], this.openOrders, this.tickers, 'buy');
      case SortingTypes.ESTIMATED_TOTAL:
        return this.sortingService.sortByEstimatedTotal([...this.currentBaseCurrencyPairs], this.balances, this.tickers, this.exchange);
      case SortingTypes.MOST_CHANGE:
        return this.sortingService.sortByHighestChange([...this.currentBaseCurrencyPairs], this.tickers);
      default:
        throw new Error(`unhandled sorting type: ${this.sortingType}`);
    }
  }
}
