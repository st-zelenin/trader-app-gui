import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import { ExchangeTab } from 'src/models/exchange-tab';

import { ExchangeComponent } from './exchange/exchange.component';
import { EXCHANGE, ExchangeUrlParams } from '../constants';
import { ExchangeSymbol, OrderedSymbols, User } from '../models';
import { AppStoreFacade } from '../store/facade';
import { UserService } from '../user.service';

@Component({
  selector: 'app-trading',
  imports: [CommonModule, MatTabsModule, ExchangeComponent],
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit {
  public user: User;
  public selectedIndex: number = 0;

  public exchangeTabs: ExchangeTab[] = [
    {
      id: EXCHANGE.GATE_IO,
      label: 'Gate.io',
      urlParam: ExchangeUrlParams.GATE_IO,
      baseCurrencies: ['USDT', 'BTC'],
      activeBaseCurrency: 'USDT',
    },
    {
      id: EXCHANGE.BINANCE,
      label: 'Binance',
      urlParam: ExchangeUrlParams.BINANCE,
      baseCurrencies: ['USDT', 'USDC'],
      activeBaseCurrency: 'USDC',
    },
    {
      id: EXCHANGE.CRYPTO_COM,
      label: 'Crypto.com',
      urlParam: ExchangeUrlParams.CRYPTO_COM,
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
      urlParam: ExchangeUrlParams.BYBIT,
      baseCurrencies: ['USDT'],
      activeBaseCurrency: 'USDT',
    },
  ];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(AppStoreFacade);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.user = this.route.snapshot.data.user;

    const exchangeParam = this.route.snapshot.paramMap.get('tab');
    if (exchangeParam) {
      this.selectedIndex = this.exchangeTabs.findIndex(({ urlParam }) => urlParam === exchangeParam);
    }
  }

  public ngOnInit(): void {
    this.facade.setPairs(this.user);
  }

  public selectedTabChange(event: MatTabChangeEvent): void {
    this.router.navigate([`trades/${this.exchangeTabs[event.index].urlParam}`]);
  }

  public addPair(newPair: ExchangeSymbol): void {
    this.userService
      .addPair(newPair)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }

  public removePair(deletedPair: ExchangeSymbol): void {
    this.userService
      .removePair(deletedPair)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }

  public orderPairs(orderedSymbols: OrderedSymbols): void {
    this.userService
      .orderPairs(orderedSymbols)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user = data;
        this.facade.setPairs(data);
      });
  }
}
