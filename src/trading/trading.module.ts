import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CryptoComComponent } from './crypto-com/crypto-com.component';
import { ExchangeActionsComponent } from './exchange-actions/exchange-actions.component';
import { GateIoComponent } from './gate-io/gate-io.component';
import { OrderFormComponent } from './shared/order-form/order-form.component';
import { PairCardContentComponent } from './shared/pair-card-content/pair-card-content.component';
import { PairCardComponent } from './shared/pair-card/pair-card.component';
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
    GateIoComponent,
    CryptoComComponent,
    ExchangeActionsComponent,
  ],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
})
export class TradingModule {}
