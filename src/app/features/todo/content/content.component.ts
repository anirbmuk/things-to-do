import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ITodo } from '@models';
import { DisplayDatePipe, GroupDatePipe } from '@pipes';
import { DateService } from '@services';
import { GroupedTodo, UpdateTodo } from '@types';

const CORE_MODULES = [CommonModule] as const;
const MATERIAL_MODULES = [MatIconModule];
const PIPES = [DisplayDatePipe, GroupDatePipe] as const;

@Component({
  standalone: true,
  imports: [...CORE_MODULES, ...MATERIAL_MODULES, ...PIPES],
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

  private readonly dateService = inject(DateService);

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
