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
import { AddTodo, GroupBy, GroupedTodo, UpdateTodo } from '../types';
import { DateService } from './date.service';
import { StorageService } from './storage.service';

const defaultSort = (todo1: ITodo, todo2: ITodo) =>
  +new Date(todo1.duedate) - +new Date(todo2.duedate);

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

  private groupByClause = new BehaviorSubject<GroupBy>('day');
  private groupByByClause$ = this.groupByClause.asObservable();

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
    return storedTodos.sort(defaultSort);
  }

  private async _findTodos(
    groupbyClause: GroupBy,
    conditions?: ((item: ITodo) => boolean)[]
  ) {
    try {
      const todos = await this._getTodos();
      if (todos.length && conditions?.length) {
        let filteredTodos = [...todos];
        for (const condition of conditions) {
          filteredTodos = filteredTodos?.filter(condition);
        }
        return this.groupTodos(filteredTodos, groupbyClause);
      }
      return this.groupTodos(todos, groupbyClause);
    } catch (err) {
      console.error('[_findTodos]', err);
      throw new Error('Error while fetching todos');
    }
  }

  findTodos() {
    return combineLatest([this.groupByByClause$, this.conditions$]).pipe(
      exhaustMap(([groupByClause, conditions]) =>
        from(this._findTodos(groupByClause, conditions)).pipe(
          catchError(() => EMPTY)
        )
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

  updateGroupBy(clause: GroupBy) {
    this.groupByClause.next(clause);
  }

  private generateTodoId() {
    return btoa(`${+new Date()}`)
      .slice(0, -2)
      .toLowerCase();
  }

  groupTodos(todos: ITodo[], groupbyClause: GroupBy) {
    const dategroups = new Set<string>();
    for (const todo of todos) {
      dategroups.add(this.groupByFn(new Date(todo.duedate), groupbyClause));
    }
    const groupedByTodos: GroupedTodo[] = [];
    for (const group of [...dategroups]) {
      const groupedTodo: GroupedTodo = {
        datedivider: group,
        todos: todos.filter(
          todo =>
            this.groupByFn(new Date(todo.duedate), groupbyClause) === group
        )
      };
      groupedByTodos.push(groupedTodo);
    }
    return groupedByTodos;
  }

  private groupByFn(duedate: Date, groupby: GroupBy): string {
    if (groupby === 'day') {
      return `${duedate.getFullYear()}-${(duedate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${duedate.getDate().toString().padStart(2, '0')}`;
    } else if (groupby === 'month') {
      return `${duedate.getFullYear()}-${(duedate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
    }
    return '';
  }
}
