import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { HttpSubmissionService } from './core/submission/http-submission.service';
import { SUBMISSION_ENDPOINT, SubmissionService } from './core/submission/submission.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    // Where requests and referrals are posted. Leave empty until the ministry has a signed
    // business associate agreement: while empty the forms stay in demo mode and send nothing.
    // Use the service's https address, with no secret keys in it (the bundle is public).
    { provide: SUBMISSION_ENDPOINT, useValue: '' },
    { provide: SubmissionService, useExisting: HttpSubmissionService },
  ],
};
