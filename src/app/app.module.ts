import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MsalGuard, MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Effects, reducer } from '../store';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,

    StoreModule.forRoot({ trading: reducer }),
    EffectsModule.forRoot([Effects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),

    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.APP_CLIENT_ID,
          redirectUri: environment.REDIRECT_URI,
        },
        cache: {
          cacheLocation: environment.CACHE_LOCATION,
          storeAuthStateInCookie: true,
        },
      }),
      {
        interactionType: InteractionType.Popup,
        authRequest: { scopes: [environment.API_SCOPE] },
      },
      {
        interactionType: InteractionType.Popup,
        protectedResourceMap: new Map([['*', [environment.API_SCOPE]]]),
      }
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
