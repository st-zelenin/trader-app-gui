/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';

import { EXCHANGE } from 'src/constants';
import { CryptoPair } from 'src/models';

import { CalculationsService } from '../calculations.service';

declare const TradingView: any;

@Component({
  selector: 'app-trading-view-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trading-view-widget.component.html',
  styleUrls: ['./trading-view-widget.component.scss'],
})
export class TradingViewWidgetComponent implements AfterViewInit, OnDestroy {
  @Input() public pair!: CryptoPair;
  @Input() public exchange!: EXCHANGE;

  public id = `tradingview-${Date.now()}`;

  private widget: any;

  private readonly calculationsService = inject(CalculationsService);

  public ngAfterViewInit(): void {
    this.widget = new TradingView.widget({
      autosize: true,
      symbol: this.calculationsService.buildTradingViewSymbol(this.pair.symbol, this.exchange),
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

  // not used
  public changeSymbol(symbol: string): void {
    this.widget.iframe.contentWindow?.postMessage({ name: 'set-symbol', type: 'post', data: { symbol } }, '*');
  }

  public ngOnDestroy(): void {
    this.widget.remove();
  }
}
