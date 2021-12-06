import { Injectable } from '@angular/core';
import { PairCardComponent } from './trading/pair-card/pair-card.component';

@Injectable({
  providedIn: 'root',
})
export class FilteringService {
  private cards: PairCardComponent[] = [];
  private isFiltered = false;

  public register(card: PairCardComponent) {
    this.cards.push(card);
  }

  public unregister(card: PairCardComponent) {
    const index = this.cards.indexOf(card);
    console.log('index', index);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }

  public toggleFilter() {
    if (this.isFiltered) {
      for (const card of this.cards) {
        card.hidden = false;
      }
    } else {
      for (const card of this.cards) {
        if (card.isRed) {
          card.hidden =
            card.openOrders &&
            !!card.openOrders.find(({ side }) => side === 'buy');
        } else {
          card.hidden = true;
        }
      }
    }

    this.isFiltered = !this.isFiltered;
  }
}
