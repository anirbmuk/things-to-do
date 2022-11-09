import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ITodo } from 'src/app/models';
import { StoreService } from 'src/app/store/store.service';
import { GroupBy, GroupedTodo } from 'src/app/types';

@Component({
  selector: 'ttd-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  readonly groupedtodos$: Observable<GroupedTodo[]> =
    this.todoStore.groupedtodos$;
  readonly showAll$: Observable<boolean> = this.todoStore.showAll$;
  readonly groupBy$: Observable<GroupBy> = this.todoStore.groupBy$;

  constructor(private readonly todoStore: StoreService) {}

  updateShowAll(status: boolean) {
    this.todoStore.updateShowAll(status);
  }

  updateGroupBy(groupBy: GroupBy) {
    this.todoStore.updateGroupBy(groupBy);
  }

  deleteTodoAction(todoid: ITodo['todoid']) {
    this.todoStore.deleteTodo(todoid);
  }
}
