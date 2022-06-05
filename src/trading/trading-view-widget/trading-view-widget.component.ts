import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EXCHANGE } from 'src/constants';
import { CalculationsService } from '../calculations.service';

declare const TradingView: any;

@Component({
  selector: 'app-trading-view-widget',
  templateUrl: './trading-view-widget.component.html',
  styleUrls: ['./trading-view-widget.component.scss'],
})
export class TradingViewWidgetComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() pair!: string;
  @Input() exchange!: EXCHANGE;

  public id = `tradingview-${Date.now()}`;

  private widget: any;

  constructor(private readonly calculationsService: CalculationsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.widget = new TradingView.widget({
      autosize: true,
      symbol: this.calculationsService.buildTradingViewSymbol(
        this.pair,
        this.exchange
      ),
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
    this.widget.iframe.contentWindow?.postMessage(
      { name: 'set-symbol', type: 'post', data: { symbol } },
      '*'
    );
  }

  ngOnDestroy(): void {
    this.widget.remove();
  }
}
