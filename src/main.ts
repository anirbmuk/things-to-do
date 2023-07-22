import { enableProdMode, importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TodoComponent } from './app/features/todo/todo.component';

import { environment } from '@environment';
import { AppComponent } from './app/app.component';

import { MatDialogModule } from '@angular/material/dialog';

const BASE_TITLE = 'Things TODO';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent,
    pathMatch: 'full',
    title: () => BASE_TITLE
  },
  {
    path: 'notfound',
    loadComponent: () =>
      import('./app/not-found/not-found.component').then(
        (file) => file.NotFoundComponent
      ),
    title: `404 | ${BASE_TITLE}`
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

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
  ReactiveFormsModule,
  RouterModule.forRoot(routes)
] as const;
const MATERIAL_MODULES = [MatDialogModule] as const;

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(...CORE_MODULES, ...MATERIAL_MODULES)]
}).catch((err) => console.error(err));
