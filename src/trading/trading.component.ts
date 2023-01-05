import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExchangeTab } from 'src/models/exchange-tab';
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
      baseCurrencies: ['USDT', 'USDC'],
      activeBaseCurrency: 'USDC',
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
      case EXCHANGE.BINANCE:
        this.user.binance_pairs = pairs;
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
