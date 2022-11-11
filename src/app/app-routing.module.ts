import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './features/todo/todo.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent,
    pathMatch: 'full'
  },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
