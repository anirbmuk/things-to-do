import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ITodo } from 'src/app/models';
import { GroupedTodo } from 'src/app/types';

@Component({
  selector: 'ttd-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
  @Input() todos: GroupedTodo[] | null = [];
  @Output() deleteTodo = new EventEmitter<ITodo['todoid']>();

  trackByGroupFn(_: number, groupedTodo: GroupedTodo) {
    return groupedTodo.datedivider;
  }

  trackByTodoFn(_: number, todo: ITodo) {
    return todo.todoid;
  }

  editTodo(todo: ITodo) {}

  onDeleteTodo(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.deleteTodo.emit(todo.todoid);
  }
}
