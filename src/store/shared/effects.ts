import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class SharedEffects {
  constructor(private actions: Actions, private store: Store) {}

  // getTickers = createEffect(() =>
  //   this.actions.pipe(
  //     ofType(getAllTickers),
  //     mergeMap(() => this.historyService.getAllTickers()),
  //     map((tickers) => setAllTickers({ tickers })),
  //     catchError((err) => {
  //       console.log(err);
  //       return of(getAllTickersError());
  //     })
  //   )
  // );
}
