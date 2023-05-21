import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './features/todo/todo.component';

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
      import('./not-found/not-found.component').then(
        (file) => file.NotFoundComponent
      ),
    title: `404 | ${BASE_TITLE}`
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
