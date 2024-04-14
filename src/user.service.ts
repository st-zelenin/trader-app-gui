import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_USER } from './constants';
import { ExchangeSymbol, OrderedSymbols, User } from './models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly httpClient = inject(HttpClient);

  public getUser() {
    return this.httpClient.get<User>(`${API_URL_USER}/GetUser`);
  }

  public addPair(newPair: ExchangeSymbol): Observable<User> {
    return this.httpClient.post<User>(`${API_URL_USER}/AddPair`, newPair);
  }

  public removePair(deletedPair: ExchangeSymbol): Observable<User> {
    return this.httpClient.post<User>(
      `${API_URL_USER}/RemovePair`,
      deletedPair
    );
  }

  public orderPairs(orderedSymbols: OrderedSymbols): Observable<User> {
    return this.httpClient.post<User>(
      `${API_URL_USER}/OrderPairs`,
      orderedSymbols
    );
  }

  public togglePairArchive(pair: ExchangeSymbol): Observable<User> {
    return this.httpClient.post<User>(
      `${API_URL_USER}/TogglePairArchive`,
      pair
    );
  }
}
