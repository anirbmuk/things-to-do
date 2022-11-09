import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, combineLatest, EMPTY, exhaustMap, from, tap } from 'rxjs';
import { ITodoState } from '../models';
import { ITodo } from '../models/todo.model';
import { AddTodo, GroupBy, GroupedTodo, UpdateTodo } from '../types';
import { DateService } from './date.service';
import { StorageService } from './storage.service';

const defaultSort = (todo1: ITodo, todo2: ITodo) =>
  +new Date(todo1.duedate) - +new Date(todo2.duedate);

const OPERATORS = ['eq', '<', '>', '>=', '<='];

const defaultState: ITodoState = {
  todos: [] as GroupedTodo[],
  showAll: false,
  groupBy: 'day',
  searchString: ''
} as const;

@Injectable({
  providedIn: 'root'
})
export class TodoService extends ComponentStore<ITodoState> {
  readonly todo$ = this.select(({ todos }) => todos);
  readonly showAll$ = this.select(({ showAll }) => showAll);
  readonly searchString$ = this.select(({ searchString }) => searchString);
  readonly groupBy$ = this.select(({ groupBy }) => groupBy);

  private conditions$ = this.select(({ showAll, searchString }) => {
    const conditions: ((item: ITodo) => boolean)[] = [];

    if (!showAll) {
      conditions.push((item: ITodo) => item.status === 'Incomplete');
    }
    if (searchString) {
      let hasOperator = false;
      if (OPERATORS.some(operator => searchString.includes(operator))) {
        hasOperator = true;
        OPERATORS.forEach(operator => {
          if (searchString.includes(operator)) {
            const [, value] = searchString.split(operator);
            const comparator = +value?.trim();
            if (comparator && !isNaN(comparator)) {
              const compareConditions = this.getCompareConditions(
                operator,
                comparator
              );
              compareConditions && conditions.push(compareConditions);
            }
          }
        });
      }
      !hasOperator &&
        conditions.length &&
        conditions.push(
          (item: ITodo) =>
            item.text.toLowerCase().includes(searchString.toLowerCase()) ||
            item.heading.toLowerCase().includes(searchString.toLowerCase()) ||
            item.additional?.message
              ?.toLowerCase()
              ?.includes(searchString.toLowerCase()) ||
            false
        );
    }
    return conditions;
  });

  readonly updateTodos = this.updater(
    (state: ITodoState, todos: GroupedTodo[]) => ({
      ...state,
      todos
    })
  );

  readonly updateShowAll = this.updater(
    (state: ITodoState, showAll: boolean) => ({
      ...state,
      showAll
    })
  );

  readonly updateSearchString = this.updater(
    (state: ITodoState, searchString: string | undefined | null) => ({
      ...state,
      searchString
    })
  );

  readonly updateGroupBy = this.updater(
    (state: ITodoState, groupBy: GroupBy) => ({
      ...state,
      groupBy
    })
  );

  constructor(
    private readonly storage: StorageService,
    private readonly dates: DateService
  ) {
    super(defaultState);
    this.fetchTodos();
  }

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
    return storedTodos
      .map(todo => {
        const additional = this.getAdditionalInfo(todo);
        return {
          ...todo,
          ...(additional && { additional })
        };
      })
      .sort(defaultSort);
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

  private getAdditionalInfo(todo: ITodo) {
    return todo.status === 'Incomplete' && this.dates.getStatus(todo.duedate);
  }

  findTodos() {
    return combineLatest([this.groupBy$, this.conditions$]).pipe(
      exhaustMap(([groupByClause, conditions]) =>
        from(this._findTodos(groupByClause, conditions)).pipe(
          catchError(() => EMPTY)
        )
      )
    );
  }

  readonly fetchTodos = this.effect(param$ =>
    param$.pipe(
      exhaustMap(() =>
        this.findTodos().pipe(tap(data => this.updateTodos(data)))
      )
    )
  );

  clearTodos() {
    return this.storage.removeAll();
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

  private getCompareConditions(
    operator: string,
    comparator: number
  ): ((item: ITodo) => boolean) | undefined {
    switch (operator) {
      case '<': {
        return (item: ITodo) => (item.additional.remaining ?? 0) < comparator;
      }
      case '>': {
        return (item: ITodo) => (item.additional.remaining ?? 0) > comparator;
      }
      case '<=': {
        return (item: ITodo) => (item.additional.remaining ?? 0) <= comparator;
      }
      case '>=': {
        return (item: ITodo) => (item.additional.remaining ?? 0) >= comparator;
      }
      case 'eq': {
        return (item: ITodo) =>
          (item.additional?.remaining ?? 0) === comparator;
      }
      default: {
        return;
      }
    }
  }
}
