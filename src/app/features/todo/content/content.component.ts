import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { ITodo } from 'src/app/models';
import { DateService } from './../../../services/date.service';
import { GroupedTodo, UpdateTodo } from './../../../types';

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
  @Output() updateTodoStatus = new EventEmitter<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>();

  constructor(private readonly dateService: DateService) {}

  trackByGroupFn(_: number, groupedTodo: GroupedTodo) {
    return groupedTodo.datedivider;
  }

  trackByTodoFn(_: number, todo: ITodo) {
    return todo.todoid;
  }

  editTodo(todo: ITodo) {
    this.updateTodo.emit({
      todoid: todo.todoid,
      todo
    });
  }

  toogleStatus(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.updateTodoStatus.emit({
      todoid: todo.todoid,
      todo: {
        ...todo,
        status: todo.status === 'Complete' ? 'Incomplete' : 'Complete',
        completedon:
          todo.status === 'Incomplete'
            ? this.dateService.getStorageFormDateTime()
            : undefined
      }
    });
  }

  onDeleteTodo(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.deleteTodo.emit(todo.todoid);
  }
}
