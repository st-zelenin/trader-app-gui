import { Component, effect, inject } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import { ExchangeTab } from 'src/models/exchange-tab';

import { BotsComponent } from './bots/bots.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { EXCHANGE, ExchangeUrlParams } from '../constants';
import { ExchangeSymbol, OrderedSymbols } from '../models';
import { AppStoreFacade } from '../store/facade';
import { UserService } from '../user.service';

@Component({
  selector: 'app-trading',
  imports: [MatTabsModule, ExchangeComponent, BotsComponent],
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent {
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

  constructor() {
    const exchangeParam = this.route.snapshot.paramMap.get('tab');
    if (exchangeParam) {
      this.selectedIndex =
        exchangeParam === 'bots' ? this.exchangeTabs.length : this.exchangeTabs.findIndex(({ urlParam }) => urlParam === exchangeParam);
    }

    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.facade.setPairs(user);
      }
    });
  }

  public selectedTabChange(event: MatTabChangeEvent): void {
    if (event.index === this.exchangeTabs.length) {
      this.router.navigate(['trades/bots']);
      return;
    }

    this.router.navigate([`trades/${this.exchangeTabs[event.index].urlParam}`]);
  }

  public addPair(newPair: ExchangeSymbol): void {
    this.userService.addPair(newPair);
  }

  public removePair(deletedPair: ExchangeSymbol): void {
    this.userService.removePair(deletedPair);
  }

  public orderPairs(orderedSymbols: OrderedSymbols): void {
    this.userService.orderPairs(orderedSymbols);
  }
}
