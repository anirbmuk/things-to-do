import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { DisplayDatePipe, GroupDatePipe } from './../../pipes';

import { ActionComponent } from './action/action.component';
import { ContentComponent } from './content/content.component';
import { TodoComponent } from './todo.component';

const COMPONENTS = [TodoComponent, ContentComponent, ActionComponent] as const;
const CORE_MODULES = [CommonModule, FormsModule] as const;
const PIPES = [DisplayDatePipe, GroupDatePipe] as const;
const MATERIAL_MODULES = [MatButtonToggleModule, MatIconModule];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [...CORE_MODULES, ...MATERIAL_MODULES],
  exports: [...COMPONENTS]
})
export class TodoModule {}
