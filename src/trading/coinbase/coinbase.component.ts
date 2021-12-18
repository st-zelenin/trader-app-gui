import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EXCHANGE } from '../../constants';
import { FilteringService } from '../../filtering.service';
import { Balance, User } from '../../models';
import { AppStoreFacade } from '../../store/facade';
import { UserService } from '../../user.service';
import { CoinbaseService } from './coinbase.service';

@Component({
  selector: 'app-coinbase',
  templateUrl: './coinbase.component.html',
  styleUrls: ['./coinbase.component.scss'],
})
export class CoinbaseComponent implements OnInit {
  @Input() user!: User;

  public currencyPairs: string[] = [];
  public eur?: Observable<Balance>;
  public exchange = EXCHANGE.COINBASE;

  constructor(
    private readonly facade: AppStoreFacade,
    private readonly coinbaseService: CoinbaseService,
    private readonly userService: UserService,
    private readonly filteringService: FilteringService
  ) {}

  ngOnInit(): void {
    this.coinbaseService.getCurrencyPairs().subscribe((currencyPairs) => {
      this.currencyPairs = currencyPairs;
    });

    this.eur = this.facade.balance(this.exchange, 'EUR');
    this.refresh();
  }

  public updateUser(currencyPair: string) {
    if (!this.user.coinbase_pairs) {
      this.user.coinbase_pairs = [];
    }

    if (!currencyPair || this.user.coinbase_pairs.includes(currencyPair)) {
      return;
    }

    this.user.coinbase_pairs.push(currencyPair);

    this.userService.updateUser(this.user).subscribe((data) => {
      this.user = data;
      this.facade.getTickers(this.exchange);
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.user.coinbase_pairs,
      event.previousIndex,
      event.currentIndex
    );
    this.userService.updateUser(this.user).subscribe();
  }

  public removePair(pair: string) {
    const index = this.user.coinbase_pairs.indexOf(pair);

    if (index > -1) {
      this.user.coinbase_pairs.splice(index, 1);
      this.userService.updateUser(this.user).subscribe();
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
}
