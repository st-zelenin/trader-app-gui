import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { EXCHANGE_URL_PARAMS } from 'src/constants';
import { User } from '../models';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.scss'],
})
export class TradingComponent implements OnInit {
  public user: User;
  public activeTabIndex: number;

  private tabs: string[] = [
    EXCHANGE_URL_PARAMS.GATE_IO,
    EXCHANGE_URL_PARAMS.CRYPTO_COM,
    EXCHANGE_URL_PARAMS.COINBASE,
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.user = this.route.snapshot.data.user;
    this.activeTabIndex = this.tabs.indexOf(
      this.route.snapshot.paramMap.get('tab')!
    );

    this.route.paramMap.subscribe((paramMap) => {
      this.activeTabIndex = this.tabs.indexOf(paramMap.get('tab')!);
    });
  }

  ngOnInit(): void {}

  public selectedTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
    const url = this.router
      .createUrlTree(['trades', this.tabs[event.index]])
      .toString();

    this.router.navigate([`trades/${this.tabs[event.index]}`]);
  }
}
