/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnDestroy, inject, input } from '@angular/core';

import { EXCHANGE } from 'src/constants';
import { CryptoPair } from 'src/models';

import { CalculationsService } from '../calculations.service';

declare const TradingView: any;

@Component({
  selector: 'app-trading-view-widget',
  imports: [],
  templateUrl: './trading-view-widget.component.html',
  styleUrls: ['./trading-view-widget.component.scss'],
})
export class TradingViewWidgetComponent implements AfterViewInit, OnDestroy {
  public readonly pair = input.required<CryptoPair>();
  public readonly exchange = input.required<EXCHANGE>();

  public readonly id = `tradingview-${Date.now()}-${TradingViewWidgetComponent.counter++}`;

  private static counter = 0;
  private widget: any;

  private readonly calculationsService = inject(CalculationsService);

  public ngAfterViewInit(): void {
    this.widget = new TradingView.widget({
      autosize: true,
      symbol: this.calculationsService.buildTradingViewSymbol(this.pair().symbol, this.exchange()),
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light', // "dark"
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: this.id,
    });
  }

  public ngOnDestroy(): void {
    this.widget.remove();
  }
}
