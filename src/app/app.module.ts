import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { TodoModule } from './features/todo/todo.module';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

const COMPONENTS = [AppComponent, HeaderComponent] as const;
const CORE_MODULES = [
  BrowserModule,
  BrowserAnimationsModule,
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the application is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  })
] as const;
const CUSTOM_MODULES = [AppRoutingModule, TodoModule] as const;
const MATERIAL_MODULES = [MatToolbarModule, MatButtonModule, MatIconModule];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...CORE_MODULES, ...CUSTOM_MODULES, ...MATERIAL_MODULES],
  bootstrap: [AppComponent]
})
export class AppModule {}
