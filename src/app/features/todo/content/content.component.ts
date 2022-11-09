import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ITodo } from 'src/app/models';
import { GroupedTodo, UpdateTodo } from 'src/app/types';

@Component({
  selector: 'ttd-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
  @Input() todos: GroupedTodo[] | null = [];
  @Output() deleteTodo = new EventEmitter<ITodo['todoid']>();
  @Output() updateTodo = new EventEmitter<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>();

  trackByGroupFn(_: number, groupedTodo: GroupedTodo) {
    return groupedTodo.datedivider;
  }

  trackByTodoFn(_: number, todo: ITodo) {
    return todo.todoid;
  }

  editTodo(todo: ITodo) {
    this.updateTodo.emit({
      todoid: todo.todoid,
      todo: { ...todo, status: 'Complete' }
    });
  }

  toogleStatus(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.updateTodo.emit({
      todoid: todo.todoid,
      todo: {
        ...todo,
        status: todo.status === 'Complete' ? 'Incomplete' : 'Complete'
      }
    });
  }

  onDeleteTodo(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.deleteTodo.emit(todo.todoid);
  }
}
