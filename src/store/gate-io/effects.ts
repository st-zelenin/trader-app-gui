import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { GateIoService } from '../../trading/gate-io.service';
import { ExchangeEffects } from '../exchange-effects';
import { actions as exchangeActions } from './actions';

@Injectable()
export class GateIoEffects extends ExchangeEffects {
  constructor(actions: Actions, exchangeService: GateIoService) {
    super(actions, exchangeService, exchangeActions);
  }
}
