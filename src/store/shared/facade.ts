import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Multiplicator } from '../../models';
import { AppState } from '../state';
import { setBuyMultiplicator } from './actions';
import { buyMultiplicator } from './selectors';

@Injectable({
  providedIn: 'root',
})
export class SharedFacade {
  public buyMultiplicator = this.store.select<Multiplicator>(buyMultiplicator);

  constructor(private store: Store<AppState>) {}

  public setBuyMultiplicator(buyMultiplicator: Multiplicator) {
    this.store.dispatch(setBuyMultiplicator({ buyMultiplicator }));
  }
}
