import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrenciesResolver } from './currencies.resolver';
import { TradingComponent } from './trading.component';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {
    path: '**',
    component: TradingComponent,
    resolve: {
      user: UserResolver,
      // currencyPairs: CurrenciesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingRoutingModule {}
