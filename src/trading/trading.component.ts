import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { BUY_MULTIPLICATORS } from '../constants';
import { FilteringService } from '../filtering.service';
import { HistoryService } from '../history.service';
import { Balance, CurrencyPair, TradePair, User } from '../models';
import { Facade } from '../store/facade';
import { UserService } from '../user.service';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit {
  public multiplicators = BUY_MULTIPLICATORS;

  public currencyPairControl = new FormControl();
  public buyMultiplicatorControl = new FormControl('');

  public filteredOptions: Observable<CurrencyPair[]>;

  public pairs: TradePair[] = [];
  public user: User;
  public currencyPairs: CurrencyPair[] = [];
  public balance?: Balance;
  public usdt?: Observable<Balance>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userServise: UserService,
    private readonly historyService: HistoryService,
    private readonly facade: Facade,
    private readonly filteringService: FilteringService // public readonly dialog: MatDialog,
  ) {
    this.user = this.route.snapshot.data.user;

    this.filteredOptions = this.currencyPairControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((value) => this.filterPairs(value))
    );

    this.facade.buyMultiplicator.subscribe((buyMultiplicator) => {
      if (buyMultiplicator) {
        this.buyMultiplicatorControl.patchValue(buyMultiplicator, {
          emitEvent: false,
        });
      }
    });

    this.buyMultiplicatorControl.valueChanges.subscribe((value) => {
      this.facade.setBuyMultiplicator(value);
    });
  }

  ngOnInit(): void {
    this.historyService.getCurrencyPairs().subscribe((currencyPairs) => {
      this.currencyPairs = currencyPairs;
    });

    this.usdt = this.facade.balance('USDT');
    this.refresh();
  }

  public updateUser(): void {
    if (!this.currencyPairControl.value || !this.currencyPairControl.value.id) {
      return;
    }

    if (this.user.pairs.includes(this.currencyPairControl.value.id)) {
      return;
    }

    this.user.pairs.push(this.currencyPairControl.value.id);

    this.userServise.updateUser(this.user).subscribe((data) => {
      this.user = data;
      this.currencyPairControl.setValue('');
    });
  }

  public displayFn(pair: CurrencyPair): string {
    return pair ? pair.id : '';
  }

  private filterPairs(value: string): CurrencyPair[] {
    const filterValue = value.toLowerCase();
    console.log(value, this.currencyPairControl.value);

    return this.currencyPairs.filter((pair) =>
      pair.id.toLowerCase().includes(filterValue)
    );
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.user.pairs, event.previousIndex, event.currentIndex);
    this.userServise.updateUser(this.user).subscribe();
  }

  public removePair(pair: string) {
    const index = this.user.pairs.indexOf(pair);

    if (index > -1) {
      this.user.pairs.splice(index, 1);
      this.userServise.updateUser(this.user).subscribe();
    }
  }

  // openDialog(message: string): void {
  //   const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //     width: '250px',
  //     data: {message},
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //   });
  // }

  public refresh() {
    this.facade.getAllTickers();
    this.facade.getAllAnalytics();
    this.facade.getAllOpenOrders();
    this.facade.getBalances();
  }

  public filter() {
    this.filteringService.toggleFilter();
  }
}
