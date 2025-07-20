import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService,
} from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { effects, exchangeActionsProviders, reducers } from '../store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(reducers),
    provideEffects(effects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      connectInZone: true,
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: () =>
        new PublicClientApplication({
          auth: {
            clientId: environment.APP_CLIENT_ID,
            redirectUri: environment.REDIRECT_URI,
            authority: `https://login.microsoftonline.com/common`,
          },
          cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: true,
          },
          system: {
            loggerOptions: {
              loggerCallback: (logLevel, message) => {
                console.log(message);
              },
              logLevel: LogLevel.Info,
              piiLoggingEnabled: false,
            },
            tokenRenewalOffsetSeconds: 300,
          },
        }),
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: () => ({
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: [environment.API_SCOPE],
        },
        loginFailedRoute: '/',
      }),
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: () => {
        const protectedResourceMap = new Map<string, Array<string>>();
        protectedResourceMap.set('*', [environment.API_SCOPE]);
        return {
          interactionType: InteractionType.Redirect,
          protectedResourceMap,
        };
      },
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    ...exchangeActionsProviders,
  ],
};
