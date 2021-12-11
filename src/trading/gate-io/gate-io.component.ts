import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BUY_MULTIPLICATORS } from '../../constants';
import { FilteringService } from '../../filtering.service';
import { HistoryService } from '../../history.service';
import { Balance, User } from '../../models';
import { GateIoFacade } from '../../store/gate-io';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-gate-io',
  templateUrl: './gate-io.component.html',
  styleUrls: ['./gate-io.component.scss'],
})
export class GateIoComponent implements OnInit {
  @Input() user!: User;

  public multiplicators = BUY_MULTIPLICATORS;

  // public buyMultiplicatorControl = new FormControl('');

  // public pairs: TradePair[] = [];
  public currencyPairs: string[] = [];
  public balance?: Balance;
  public usdt?: Observable<Balance>;

  constructor(
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
    public readonly facade: GateIoFacade,
    private readonly filteringService: FilteringService
  ) {}

  ngOnInit(): void {
    this.historyService.getCurrencyPairs().subscribe((currencyPairs) => {
      this.currencyPairs = currencyPairs.map(({ id }) => id);
    });

    this.usdt = this.facade.balance('USDT');
    this.refresh();
  }

  public updateUser(currencyPair: string): void {
    if (!currencyPair || this.user.pairs.includes(currencyPair)) {
      return;
    }

    this.user.pairs.push(currencyPair);

    this.userService.updateUser(this.user).subscribe((data) => {
      this.user = data;
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.user.pairs, event.previousIndex, event.currentIndex);
    this.userService.updateUser(this.user).subscribe();
  }

  public removePair(pair: string) {
    const index = this.user.pairs.indexOf(pair);

    if (index > -1) {
      this.user.pairs.splice(index, 1);
      this.userService.updateUser(this.user).subscribe();
    }
  }

  public refresh() {
    this.facade.getTickers();
    this.facade.getAnalytics();
    this.facade.getOpenOrders();
    this.facade.getBalances();
  }

  public filter() {
    this.filteringService.toggleFilter();
  }
}
