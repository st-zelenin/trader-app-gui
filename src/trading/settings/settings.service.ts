import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL_GATE } from '../../constants';

@Injectable({ providedIn: 'root' })
export class SettingService {
  private readonly httpClient = inject(HttpClient);

  public doSomeTechService() {
    return this.httpClient.get(`${API_URL_GATE}/DoSomeTechService`);
  }
}
