import { ApplicationRef, enableProdMode } from '@angular/core';
import { bootstrapApplication, enableDebugTools } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    if (!environment.production) {
      enableDebugTools(appRef.injector.get(ApplicationRef).components[0]);
    }
  })
  .catch((err) => console.error(err));
