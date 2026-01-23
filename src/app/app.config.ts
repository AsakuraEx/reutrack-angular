import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { Interceptor } from './services/interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './config/spanish-paginator-intl';
import { provideEnvironmentNgxMask, NgxMaskConfig } from 'ngx-mask'
import { MAT_DATE_LOCALE } from '@angular/material/core';

const maskConfig: Partial<NgxMaskConfig> = {
  validation: false
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEnvironmentNgxMask(maskConfig),
    provideHttpClient(
      withInterceptors([ Interceptor ])
    ),
    provideHotToastConfig(),
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { 
      provide: MAT_DATE_LOCALE, 
      useValue: 'es-SV'
    }, 


  ]
};
