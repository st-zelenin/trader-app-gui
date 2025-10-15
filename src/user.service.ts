import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_URL_USER } from './constants';
import { ExchangeSymbol, OrderedSymbols, User } from './models';

@Injectable({ providedIn: 'root' })
export class UserService {
  public readonly user: Signal<User | null>;

  private readonly _user = signal<User | null>(null);
  private readonly httpClient = inject(HttpClient);

  constructor() {
    this.user = this._user.asReadonly();
  }

  public getUser(): Observable<User> {
    return this.httpClient.get<User>(`${API_URL_USER}/GetUser`).pipe(tap((user) => this._user.set(user)));
  }

  public addPair(newPair: ExchangeSymbol): void {
    this.httpClient
      .post<User>(`${API_URL_USER}/AddPair`, newPair)
      .pipe(tap((user) => this._user.set(user)))
      .subscribe();
  }

  public removePair(deletedPair: ExchangeSymbol): void {
    this.httpClient
      .post<User>(`${API_URL_USER}/RemovePair`, deletedPair)
      .pipe(tap((user) => this._user.set(user)))
      .subscribe();
  }

  public orderPairs(orderedSymbols: OrderedSymbols): void {
    this.httpClient
      .post<User>(`${API_URL_USER}/OrderPairs`, orderedSymbols)
      .pipe(tap((user) => this._user.set(user)))
      .subscribe();
  }

  public togglePairArchive(pair: ExchangeSymbol): void {
    this.httpClient
      .post<User>(`${API_URL_USER}/TogglePairArchive`, pair)
      .pipe(tap((user) => this._user.set(user)))
      .subscribe();
  }
}
