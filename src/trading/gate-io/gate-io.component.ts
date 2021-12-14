import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStoreFacade } from 'src/store/facade';
import { BUY_MULTIPLICATORS, EXCHANGE } from '../../constants';
import { FilteringService } from '../../filtering.service';
import { Balance, User } from '../../models';
import { UserService } from '../../user.service';
import { GateIoService } from './gate-io.service';

@Component({
  selector: 'app-gate-io',
  templateUrl: './gate-io.component.html',
  styleUrls: ['./gate-io.component.scss'],
})
export class GateIoComponent implements OnInit {
  @Input() user!: User;

  public multiplicators = BUY_MULTIPLICATORS;

  public currencyPairs: string[] = [];
  public balance?: Balance;
  public usdt?: Observable<Balance>;
  public exchange = EXCHANGE.GATE_IO;

  constructor(
    private readonly userService: UserService,
    private readonly gateIoService: GateIoService,
    private readonly facade: AppStoreFacade,
    private readonly filteringService: FilteringService
  ) {}

  ngOnInit(): void {
    this.gateIoService.getCurrencyPairs().subscribe((currencyPairs) => {
      this.currencyPairs = currencyPairs.map(({ id }) => id);
    });

    this.usdt = this.facade.balance(this.exchange, 'USDT');
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
    this.facade.getTickers(this.exchange);
    this.facade.getAnalytics(this.exchange);
    this.facade.getOpenOrders(this.exchange);
    this.facade.getBalances(this.exchange);
  }

  public filter() {
    this.filteringService.toggleFilter();
  }
}
