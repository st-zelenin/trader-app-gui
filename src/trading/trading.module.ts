import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ExchangeActionsComponent } from './exchange-actions/exchange-actions.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { FishnetComponent } from './fishnet/fishnet.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { PairCardContentComponent } from './pair-card-content/pair-card-content.component';
import { PairCardComponent } from './pair-card/pair-card.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { SettingsComponent } from './settings/settings.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { TradingRoutingModule } from './trading-routing.module';
import { TradingViewWidgetComponent } from './trading-view-widget/trading-view-widget.component';
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
    RecentOrdersComponent,
    ConfirmationDialogComponent,
    SettingsComponent,
    FishnetComponent,
    TradingViewWidgetComponent,
  ],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
})
export class TradingModule {}
