import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_USER } from 'src/constants';

@Injectable({ providedIn: 'root' })
export class SettingService {
  constructor(private readonly httpClient: HttpClient) {}

  public doSomeTechService() {
    return this.httpClient.get(`${API_URL_USER}/DoSomeTechService`);
  }
}
