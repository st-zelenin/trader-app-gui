import { Injectable } from '@angular/core';

import { Filterable, FilteringType } from '../models';

@Injectable({ providedIn: 'root' })
export class FilteringService {
  private cards: Filterable[] = [];

  public register(card: Filterable): void {
    this.cards.push(card);
  }

  public unregister(card: Filterable): void {
    const index = this.cards.indexOf(card);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }

  public toggleFilter(filteringType: FilteringType): void {
    if (filteringType === FilteringType.NONE) {
      for (const card of this.cards) {
        card.hidden = false;
      }
    } else {
      for (const card of this.cards) {
        card.hidden = this.getHidden(filteringType, card);
      }
    }
  }

  private getHidden(filteringType: FilteringType, card: Filterable): boolean {
    switch (filteringType) {
      case FilteringType.MISSING_BUY:
        return card.openOrders && !!card.openOrders.find(({ side }) => side === 'buy');
      // return card.isRed
      //   ? card.openOrders &&
      //       !!card.openOrders.find(({ side }) => side === 'buy')
      //   : true;
      case FilteringType.ATTENTION_MESSAGE:
        return !card.attentionMessage;
      default:
        throw new Error(`unhandled ${filteringType} filtering type`);
    }
  }
}
