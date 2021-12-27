import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { EXCHANGE } from '../../constants';
import { Balance, OpenOrdersByPairs, Tickers } from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { FilteringService } from '../filtering.service';
import { SortingService } from '../sorting.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {
  @Input() exchange!: EXCHANGE;
  @Input() baseCurrency!: string;

  @Output() updatePairs = new EventEmitter<{
    exchange: EXCHANGE;
    pairs: string[];
  }>();

  public pairs: string[] = [];
  public currencyPairs?: Observable<string[]>;
  public baseCurrencyBalance?: Observable<Balance>;

  private openOrders: OpenOrdersByPairs = {};
  private tickers: Tickers = {};
  private isSorted = false;
  private notSortedPairs: string[] = [];

  constructor(
    private readonly facade: AppStoreFacade,
    private readonly filteringService: FilteringService,
    private readonly sortingService: SortingService
  ) {}

  ngOnInit(): void {
    this.facade.pairs(this.exchange).subscribe((pairs) => {
      this.notSortedPairs = [...pairs];

      this.pairs = this.isSorted
        ? this.sortingService.sort([...pairs], this.openOrders, this.tickers)
        : [...pairs];
      this.facade.getTickers(this.exchange);
    });

    this.facade.openOrders(this.exchange).subscribe((openOrders) => {
      this.openOrders = openOrders;
    });

    this.facade.tickers(this.exchange).subscribe((tickers) => {
      this.tickers = tickers;
    });

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
    const index = this.notSortedPairs.indexOf(pair);

    if (index > -1) {
      this.notSortedPairs.splice(index, 1);
      this.updatePairs.emit({
        exchange: this.exchange,
        pairs: this.notSortedPairs,
      });
    }
  }

  public refresh() {
    this.facade.getAnalytics(this.exchange);
    this.facade.getOpenOrders(this.exchange);
    this.facade.getTickers(this.exchange);
    this.facade.getBalances(this.exchange);
  }

  public filter() {
    this.filteringService.toggleFilter();
  }

  public sort() {
    this.isSorted = !this.isSorted;

    this.pairs = this.isSorted
      ? this.sortingService.sort(this.pairs, this.openOrders, this.tickers)
      : [...this.notSortedPairs];
  }
}
