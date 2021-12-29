import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public isLoggedIn = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.isLoggedIn = this.getLoggedIn();
    this.initUser();
  }

  public login() {
    this.authService
      .loginPopup()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result) => {
          console.log(result);
          this.isLoggedIn = this.getLoggedIn();
          this.initUser();
        },
        error: (error) => console.log(error),
      });
  }

  private getLoggedIn() {
    return this.authService.instance.getAllAccounts().length > 0;
  }

  private initUser() {
    if (!this.isLoggedIn) {
      return;
    }

    const { pathname } = window.location;
    this.router.navigate([pathname === '/' ? 'trades' : pathname]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
