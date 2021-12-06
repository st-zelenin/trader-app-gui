import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public isLoggedIn = false;

  constructor(private authService: MsalService, private router: Router) {
    this.isLoggedIn = this.getLoggedIn();
    this.initUser();
  }

  public login() {
    this.authService.loginPopup().subscribe({
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

    this.router.navigate(['trades/']);
  }
}
