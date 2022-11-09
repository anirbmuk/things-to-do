import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, EMPTY, from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  switchMap,
  tap
} from 'rxjs/operators';
import { ITodo, ITodoState } from '../models';
import { TodoService } from '../services';
import { GroupBy, GroupedTodo } from '../types';

const defaultState: ITodoState = {
  todos: [] as GroupedTodo[],
  showAll: false,
  groupBy: 'day',
  searchString: ''
} as const;

const OPERATORS = ['eq', '<', '>', '>=', '<='];

@Injectable({
  providedIn: 'root'
})
export class StoreService extends ComponentStore<ITodoState> {
  readonly groupedtodos$ = this.select(({ todos }) => todos);
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

  readonly filteredTodos$ = combineLatest([
    this.groupBy$,
    this.conditions$
  ]).pipe(
    exhaustMap(([groupByClause, conditions]) =>
      from(this.todoService.getTodos(groupByClause, conditions)).pipe(
        catchError(() => EMPTY)
      )
    )
  );

  readonly fetchTodos = this.effect<void>(param$ =>
    param$.pipe(
      switchMap(() =>
        this.filteredTodos$.pipe(tap(data => this.updateTodos(data)))
      )
    )
  );

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

  readonly deleteTodo = this.effect<ITodo['todoid']>(todoid$ =>
    todoid$.pipe(
      concatMap(todoid =>
        from(this.todoService.deleteTodo(todoid)).pipe(
          tap(() => this.fetchTodos()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(private readonly todoService: TodoService) {
    super(defaultState);
    this.fetchTodos();
  }

  private getCompareConditions(
    operator: string,
    comparator: number
  ): ((item: ITodo) => boolean) | undefined {
    switch (operator) {
      case '<': {
        return (item: ITodo) => (item.additional?.remaining ?? 0) < comparator;
      }
      case '>': {
        return (item: ITodo) => (item.additional?.remaining ?? 0) > comparator;
      }
      case '<=': {
        return (item: ITodo) => (item.additional?.remaining ?? 0) <= comparator;
      }
      case '>=': {
        return (item: ITodo) => (item.additional?.remaining ?? 0) >= comparator;
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
