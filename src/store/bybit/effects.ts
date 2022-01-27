import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { BybitService } from '../../trading/bybit.service';
import { ExchangeEffects } from '../exchange-effects';
import { actions as exchangeActions } from './actions';

@Injectable()
export class BybitEffects extends ExchangeEffects {
  constructor(actions: Actions, exchangeService: BybitService) {
    super(actions, exchangeService, exchangeActions);
  }
}
