import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { CoinbaseService } from '../../trading/coinbase.service';
import { ExchangeEffects } from '../exchange-effects';
import { actions as exchangeActions } from './actions';

@Injectable()
export class CoinbaseEffects extends ExchangeEffects {
  constructor(actions: Actions, exchangeService: CoinbaseService) {
    super(actions, exchangeService, exchangeActions);
  }
}
