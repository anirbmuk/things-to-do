import { enableProdMode, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app/app-routing.module';

import { environment } from '@environment';
import { AppComponent } from './app/app.component';

import { MatDialogModule } from '@angular/material/dialog';

if (environment.production) {
  enableProdMode();
}

const CORE_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
  ReactiveFormsModule
] as const;
const MATERIAL_MODULES = [MatDialogModule] as const;
const CUSTOM_MODULES = [AppRoutingModule] as const;

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(...CORE_MODULES, ...CUSTOM_MODULES, ...MATERIAL_MODULES)
  ]
}).catch((err) => console.error(err));
