import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance, User } from '../../models';
import { CryptoComFacade } from '../../store/crypto-com';
import { UserService } from '../../user.service';
import { CryptoComService } from './crypto-com.service';

@Component({
  selector: 'app-crypto-com',
  templateUrl: './crypto-com.component.html',
  styleUrls: ['./crypto-com.component.scss'],
})
export class CryptoComComponent implements OnInit {
  @Input() user!: User;

  public currencyPairs: string[] = [];
  public usdt?: Observable<Balance>;

  constructor(
    public readonly facade: CryptoComFacade,
    private readonly historyService: CryptoComService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.historyService.getCurrencyPairs().subscribe((currencyPairs) => {
      this.currencyPairs = currencyPairs;
    });

    this.facade.ticker('CRO_USDT').subscribe(console.log);
    this.usdt = this.facade.balance('USDT');

    this.refresh();
  }

  public updateUser(currencyPair: string) {
    if (!currencyPair || this.user.crypto_pairs.includes(currencyPair)) {
      return;
    }

    this.user.crypto_pairs.push(currencyPair);

    this.userService.updateUser(this.user).subscribe((data) => {
      this.user = data;
    });
  }

  public drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.user.crypto_pairs,
      event.previousIndex,
      event.currentIndex
    );
    this.userService.updateUser(this.user).subscribe();
  }

  public removePair(pair: string) {
    const index = this.user.crypto_pairs.indexOf(pair);

    if (index > -1) {
      this.user.crypto_pairs.splice(index, 1);
      this.userService.updateUser(this.user).subscribe();
    }
  }

  public refresh() {
    this.facade.getAnalytics();
    this.facade.getAllOpenOrders();
    this.facade.getTickers();
    this.facade.getBalances();

    // this.historyService.importYearHistory().subscribe(console.log);
  }

  public filter() {
    // this.filteringService.toggleFilter();
  }
}
