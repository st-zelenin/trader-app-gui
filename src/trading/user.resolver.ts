import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from '../models';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  resolve(): Observable<User> {
    return this.userService.getUser();
  }
}
