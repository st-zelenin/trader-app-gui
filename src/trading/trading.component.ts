import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EXCHANGE, EXCHANGE_URL_PARAMS } from '../constants';
import { User } from '../models';
import { AppStoreFacade } from '../store/facade';
import { UserService } from '../user.service';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit, OnDestroy {
  public user: User;
  public activeTabIndex: number;
  public exchanges = EXCHANGE;

  // TODO: should be part of user entity
  public gateIoBaseCurrencies = ['USDT', 'BTC'];
  public cryptoComBaseCurrencies = ['USDT'];
  public coinbaseBaseCurrencies = ['EUR'];
  public bybitBaseCurrencies = ['USDT'];

  private tabs: string[] = [
    EXCHANGE_URL_PARAMS.GATE_IO,
    EXCHANGE_URL_PARAMS.CRYPTO_COM,
    EXCHANGE_URL_PARAMS.COINBASE,
    EXCHANGE_URL_PARAMS.BYBIT,
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly facade: AppStoreFacade,
    private readonly userService: UserService
  ) {
    this.user = this.route.snapshot.data.user;
    this.activeTabIndex = this.tabs.indexOf(
      this.route.snapshot.paramMap.get('tab')!
    );

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramMap) => {
        this.activeTabIndex = this.tabs.indexOf(paramMap.get('tab')!);
      });
  }

  ngOnInit(): void {
    this.facade.setPairs(this.user);
  }

  public selectedTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    this.router.navigate([`trades/${this.tabs[event.index]}`]);
  }

  public updateUser({
    exchange,
    pairs,
  }: {
    exchange: EXCHANGE;
    pairs: string[];
  }) {
    console.log('updateUser', exchange, pairs);

    // TODO: move to store
    switch (exchange) {
      case EXCHANGE.GATE_IO:
        this.user.pairs = pairs;
        break;
      case EXCHANGE.CRYPTO_COM:
        this.user.crypto_pairs = pairs;
        break;
      case EXCHANGE.COINBASE:
        this.user.coinbase_pairs = pairs;
        break;
      case EXCHANGE.BYBIT:
        this.user.bybit_pairs = pairs;
        break;
      default:
        throw new Error(`unhabdled exchange type: ${exchange}`);
    }

    this.userService
      .updateUser(this.user)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
