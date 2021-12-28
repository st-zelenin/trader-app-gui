import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { CryptoComService } from '../../trading/crypto-com.service';
import { ExchangeEffects } from '../exchange-effects';
import { actions as exchangeActions } from './actions';

@Injectable()
export class CryptoComEffects extends ExchangeEffects {
  constructor(actions: Actions, exchangeService: CryptoComService) {
    super(actions, exchangeService, exchangeActions);
  }
}
