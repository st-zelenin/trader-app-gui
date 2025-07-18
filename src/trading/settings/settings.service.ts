import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL_BINANCE } from '../../constants';

@Injectable({ providedIn: 'root' })
export class SettingService {
  private readonly httpClient = inject(HttpClient);

  public doSomeTechService(): Observable<unknown> {
    return this.httpClient.get(`${API_URL_BINANCE}/DoSomeTechService___`);
  }
}
