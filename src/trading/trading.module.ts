import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExchangeActionsComponent } from './exchange-actions/exchange-actions.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { PairCardContentComponent } from './pair-card-content/pair-card-content.component';
import { PairCardComponent } from './pair-card/pair-card.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { TradingRoutingModule } from './trading-routing.module';
import { TradingComponent } from './trading.component';

@NgModule({
  declarations: [
    TradingComponent,
    PairCardComponent,
    PairCardContentComponent,
    OrderFormComponent,
    TradeHistoryComponent,
    ExchangeActionsComponent,
    ExchangeComponent,
  ],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
})
export class TradingModule {}
