import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingComponent } from './trading.component';
import { TradingRoutingModule } from './trading-routing.module';
import { PairTabComponent } from './pair-tab/pair-tab.component';
import { SharedModule } from '../shared/shared.module';
import { PairPanelComponent } from './pair-panel/pair-panel.component';
import { PairCardComponent } from './pair-card/pair-card.component';
import { PairCardContentComponent } from './pair-card-content/pair-card-content.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';

@NgModule({
  declarations: [
    TradingComponent,
    PairTabComponent,
    PairPanelComponent,
    PairCardComponent,
    PairCardContentComponent,
    OrderFormComponent,
    TradeHistoryComponent,
  ],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
})
export class TradingModule {}
