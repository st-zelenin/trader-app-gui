import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models';
import { API_URL } from './models/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public getUser() {
    return this.httpClient.get<User>(`${API_URL}/getUser`);
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${API_URL}/updateUser`, user);
  }
}
