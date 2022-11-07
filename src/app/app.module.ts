import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { DisplayDatePipe, GroupDatePipe } from './pipes';

const COMPONENTS = [AppComponent];
const PIPES = [DisplayDatePipe, GroupDatePipe];
const CORE_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  })
];
const CUSTOM_MODULES = [AppRoutingModule];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [...CORE_MODULES, ...CUSTOM_MODULES],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
