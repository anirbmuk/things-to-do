import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from 'src/app/services';
import { GroupBy, GroupedTodo } from 'src/app/types';

@Component({
  selector: 'ttd-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  readonly groupedtodo$: Observable<GroupedTodo[]> = this.todoService.todo$;
  readonly showAll$: Observable<boolean> = this.todoService.showAll$;
  readonly groupBy$: Observable<GroupBy> = this.todoService.groupBy$;
  readonly searchString$: Observable<string | undefined | null> =
    this.todoService.searchString$;

  constructor(private readonly todoService: TodoService) {}

  updateShowAll(status: boolean) {
    this.todoService.updateShowAll(status);
  }

  updateGroupBy(groupBy: GroupBy) {
    this.todoService.updateGroupBy(groupBy);
  }

  updateSearchString(searchString: string | undefined | null) {
    this.todoService.updateSearchString(searchString);
  }
}
