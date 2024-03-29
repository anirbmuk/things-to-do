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
import { CountTodoPipe, DisplayDatePipe, GroupDatePipe } from '@pipes';
import { DateService } from '@services';
import { GroupedTodo, UpdateTodo } from '@types';

const CORE_MODULES = [CommonModule] as const;
const MATERIAL_MODULES = [MatIconModule];
const PIPES = [DisplayDatePipe, GroupDatePipe, CountTodoPipe] as const;

@Component({
  standalone: true,
  imports: [...CORE_MODULES, ...MATERIAL_MODULES, ...PIPES],
  selector: 'ttd-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
  @Input({ required: true }) todos: GroupedTodo[] | null = [];
  @Input({ required: true }) totalPending: number | null = 0;

  @Output() deleteTodo = new EventEmitter<ITodo['todoid']>();
  @Output() updateTodo = new EventEmitter<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>();
  @Output() updateTodoStatus = new EventEmitter<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>();
  @Output() shareTodo = new EventEmitter<string>();

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

  toggleStatus(event: Event, todo: ITodo) {
    event.stopPropagation();
    const status = todo.status === 'Complete' ? 'Incomplete' : 'Complete';
    this.updateTodoStatus.emit({
      todoid: todo.todoid,
      todo: {
        ...todo,
        status,
        completedon:
          status === 'Complete'
            ? this.dateService.getStorageFormDateTime()
            : undefined
      }
    });
  }

  onDeleteTodo(event: Event, todo: ITodo) {
    event.stopPropagation();
    this.deleteTodo.emit(todo.todoid);
  }

  onShareTodo(event: Event, todo: ITodo) {
    event.stopPropagation();
    const headingLength = Math.max(Math.floor(todo.heading.length * 1.5), 10);
    const fill = (new Array(headingLength) as string[]).fill('-', 0).join('');
    const data = `${todo.heading || ''}\n${fill}\n${todo.text || ''}\n`;
    this.shareTodo.emit(data);
  }
}
