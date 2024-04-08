import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExchangeTab } from 'src/models/exchange-tab';
import { EXCHANGE, EXCHANGE_URL_PARAMS } from '../constants';
import { ExchangeSymbol, OrderedSymbols, User } from '../models';
import { AppStoreFacade } from '../store/facade';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ExchangeComponent } from './exchange/exchange.component';

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [CommonModule, MatTabsModule, ExchangeComponent],
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit, OnDestroy {
  public user: User;
  public selectedIndex: number = 0;

  public exchangeTabs: ExchangeTab[] = [
    {
      id: EXCHANGE.GATE_IO,
      label: 'Gate.io',
      urlParam: EXCHANGE_URL_PARAMS.GATE_IO,
      baseCurrencies: ['USDT', 'BTC'],
      activeBaseCurrency: 'USDT',
    },
    {
      id: EXCHANGE.BINANCE,
      label: 'Binance',
      urlParam: EXCHANGE_URL_PARAMS.BINANCE,
      baseCurrencies: ['USDT'],
      activeBaseCurrency: 'USDT',
    },
    {
      id: EXCHANGE.CRYPTO_COM,
      label: 'Crypto.com',
      urlParam: EXCHANGE_URL_PARAMS.CRYPTO_COM,
      baseCurrencies: ['USDT', 'USD'],
      activeBaseCurrency: 'USD',
    },
    // {
    //   id: EXCHANGE.COINBASE,
    //   label: 'Coinbase',
    //   urlParam: EXCHANGE_URL_PARAMS.COINBASE,
    //   baseCurrencies: ['EUR'],
    //   activeBaseCurrency: 'EUR',
    // },
    {
      id: EXCHANGE.BYBIT,
      label: 'Bybit',
      urlParam: EXCHANGE_URL_PARAMS.BYBIT,
      baseCurrencies: ['USDT'],
      activeBaseCurrency: 'USDT',
    },
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly facade: AppStoreFacade,
    private readonly userService: UserService
  ) {
    this.user = this.route.snapshot.data.user;

    const exchangeParam = this.route.snapshot.paramMap.get('tab');
    if (exchangeParam) {
      this.selectedIndex = this.exchangeTabs.findIndex(
        ({ urlParam }) => urlParam === exchangeParam
      );
    }
  }

  ngOnInit(): void {
    this.facade.setPairs(this.user);
  }

  public selectedTabChange(event: MatTabChangeEvent) {
    this.router.navigate([`trades/${this.exchangeTabs[event.index].urlParam}`]);
  }

  public addPair(newPair: ExchangeSymbol) {
    this.userService
      .addPair(newPair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }

  public removePair(deletedPair: ExchangeSymbol) {
    this.userService
      .removePair(deletedPair)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }

  public orderPairs(orderedSymbols: OrderedSymbols) {
    this.userService
      .orderPairs(orderedSymbols)
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
