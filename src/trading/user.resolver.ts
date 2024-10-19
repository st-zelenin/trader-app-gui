import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../models';
import { UserService } from '../user.service';

@Injectable({ providedIn: 'root' })
export class UserResolver {
  private readonly userService = inject(UserService);

  public resolve(): Observable<User> {
    return this.userService.getUser();
  }
}
