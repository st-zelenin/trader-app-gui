import { Injectable } from '@angular/core';
import { Filterable, FILTERING_TYPE } from '../models';

@Injectable({ providedIn: 'root' })
export class FilteringService {
  private cards: Filterable[] = [];

  public register(card: Filterable) {
    this.cards.push(card);
  }

  public unregister(card: Filterable) {
    const index = this.cards.indexOf(card);
    console.log('index', index);
    if (index > -1) {
      this.cards.splice(index, 1);
    }
  }

  public toggleFilter(filteringType: FILTERING_TYPE) {
    if (filteringType === FILTERING_TYPE.NONE) {
      for (const card of this.cards) {
        card.hidden = false;
      }
    } else {
      for (const card of this.cards) {
        card.hidden = this.getHidden(filteringType, card);
      }
    }
  }

  private getHidden(filteringType: FILTERING_TYPE, card: Filterable) {
    switch (filteringType) {
      case FILTERING_TYPE.MISSING_BUY:
        return (
          card.openOrders &&
          !!card.openOrders.find(({ side }) => side === 'buy')
        );
      // return card.isRed
      //   ? card.openOrders &&
      //       !!card.openOrders.find(({ side }) => side === 'buy')
      //   : true;
      case FILTERING_TYPE.ATTENTION_MESSAGE:
        return !card.attentionMessage;
      default:
        throw new Error(`unhandled ${filteringType} filtering type`);
    }
  }
}
