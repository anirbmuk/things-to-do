import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  exhaustMap,
  from,
  map
} from 'rxjs';
import { ITodo } from '../models/todo.model';
import { AddTodo, UpdateTodo } from '../types/todo.type';
import { DateService } from './date.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private showAll = new BehaviorSubject<boolean>(false);
  private showAll$ = this.showAll.asObservable();

  private searchString = new BehaviorSubject<string | undefined | null>(
    undefined
  );
  private searchString$ = this.searchString.asObservable();

  private conditions$ = combineLatest([this.showAll$, this.searchString$]).pipe(
    map(([showAll, searchString]) => {
      const conditions: ((item: ITodo) => boolean)[] = [];

      if (!showAll) {
        conditions.push((item: ITodo) => item.status === 'Incomplete');
      }
      if (searchString) {
        conditions.push(
          (item: ITodo) =>
            item.text.toLowerCase().includes(searchString.toLowerCase()) ||
            item.heading.toLowerCase().includes(searchString.toLowerCase())
        );
      }

      return conditions;
    })
  );

  constructor(
    private readonly storage: StorageService,
    private readonly dates: DateService
  ) {}

  addTodo(todo: AddTodo) {
    const duedateUTC = this.dates.getStorageDate(todo.duedate);
    return this.storage.addItem<ITodo>({
      ...todo,
      todoid: this.generateTodoId(),
      ...(duedateUTC && { duedate: duedateUTC })
    });
  }

  updateTodo(todoid: ITodo['todoid'], todo: UpdateTodo) {
    return this.storage.updateItem<ITodo, UpdateTodo>('todoid', todoid, todo);
  }

  deleteTodo(todoid: ITodo['todoid']) {
    return this.storage.deleteItem<ITodo>('todoid', todoid);
  }

  private async _getTodos() {
    const storedTodos = await this.storage.getItems<ITodo>();
    return storedTodos.sort(
      (todo1, todo2) => +new Date(todo1.duedate) - +new Date(todo2.duedate)
    );
  }

  private async _findTodos(conditions?: ((item: ITodo) => boolean)[]) {
    try {
      const todos = await this._getTodos();
      if (todos.length && conditions?.length) {
        let filteredTodos = [...todos];
        for (const condition of conditions) {
          filteredTodos = filteredTodos?.filter(condition);
        }
        return filteredTodos;
      }
      return todos;
    } catch (err) {
      console.error('[_findTodos]', err);
      throw new Error('Error while fetching todos');
    }
  }

  findTodos() {
    return this.conditions$.pipe(
      exhaustMap(conditions =>
        from(this._findTodos(conditions)).pipe(catchError(() => EMPTY))
      )
    );
  }

  clearTodos() {
    return this.storage.removeAll();
  }

  toggleShowAll(status: boolean) {
    this.showAll.next(status);
  }

  searchText(text: string | undefined | null) {
    this.searchString.next(text);
  }

  private generateTodoId() {
    return btoa(`${+new Date()}`)
      .slice(0, -2)
      .toLowerCase();
  }
}
