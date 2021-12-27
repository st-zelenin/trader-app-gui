import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<User> {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<User> {
    return this.userService.getUser();
  }
}
