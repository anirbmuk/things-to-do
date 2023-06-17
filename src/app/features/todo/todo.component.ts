import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ActionComponent } from './action/action.component';
import { ContentComponent } from './content/content.component';

import { ITodo } from '@models';
import { StoreService } from '@store';
import { GroupBy, GroupedTodo, UpdateTodo } from '@types';

const CORE_MODULES = [CommonModule] as const;
const COMPONENTS = [ContentComponent, ActionComponent] as const;

@Component({
  standalone: true,
  imports: [...CORE_MODULES, ...COMPONENTS],
  selector: 'ttd-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  private readonly todoStore = inject(StoreService);
  readonly groupedtodos$: Observable<GroupedTodo[]> =
    this.todoStore.groupedtodos$;
  readonly totalPending$: Observable<number> = this.todoStore.totalPending$;
  readonly showAll$: Observable<boolean> = this.todoStore.showAll$;
  readonly groupBy$: Observable<GroupBy> = this.todoStore.groupBy$;

  updateShowAll(status: boolean) {
    this.todoStore.updateShowAll(status);
  }

  updateGroupBy(groupBy: GroupBy) {
    this.todoStore.updateGroupBy(groupBy);
  }

  updateStatusAction(param: { todoid: ITodo['todoid']; todo: UpdateTodo }) {
    this.todoStore.updateTodo(param);
  }

  updateTodoAction(param: { todoid: ITodo['todoid']; todo: UpdateTodo }) {
    this.todoStore.updateTodoModal(param);
  }

  deleteTodoAction(todoid: ITodo['todoid']) {
    this.todoStore.deleteTodoWithConfirmation(todoid);
  }

  shareTodoAction(text: string) {
    window.navigator.share({ title: 'Sharing my TODO item', text });
  }
}
