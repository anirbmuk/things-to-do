import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, EMPTY, from } from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  filter,
  switchMap,
  tap
} from 'rxjs/operators';
import { ModalService } from '../modals';
import { ITodo, ITodoState } from '../models';
import { TodoService } from '../services';
import { AddTodo, GroupBy, GroupedTodo, UpdateTodo } from '../types';

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

  readonly addTodo = this.effect<AddTodo>(param$ =>
    param$.pipe(
      concatMap(param =>
        from(this.todoService.addTodo(param)).pipe(
          tap(() => this.fetchTodos()),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly addTodoModal = this.effect<void>(param$ =>
    param$.pipe(
      concatMap(() =>
        this.modalService.showCreateUpdateDialog('create').pipe(
          filter(data => data.decision),
          tap(data => {
            const dataToBeCreated = { ...data.output } as AddTodo;
            this.addTodo(dataToBeCreated);
          }),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly updateTodo = this.effect<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>(param$ =>
    param$.pipe(
      concatMap(param =>
        from(this.todoService.updateTodo(param)).pipe(
          tap(() => this.fetchTodos()),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly updateTodoModal = this.effect<{
    todoid: ITodo['todoid'];
    todo: UpdateTodo;
  }>(param$ =>
    param$.pipe(
      concatMap(param =>
        this.modalService
          .showCreateUpdateDialog('update', { ...param.todo })
          .pipe(
            filter(data => data.decision),
            tap(data => {
              const dataToBeUpdated = { ...data.output } as UpdateTodo;
              this.updateTodo({ todoid: param.todoid, todo: dataToBeUpdated });
            }),
            catchError(this.handleError)
          )
      )
    )
  );

  readonly deleteTodo = this.effect<ITodo['todoid']>(todoid$ =>
    todoid$.pipe(
      concatMap(todoid =>
        from(this.todoService.deleteTodo(todoid)).pipe(
          tap(() => this.fetchTodos()),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly deleteTodoWithConfirmation = this.effect<ITodo['todoid']>(todoid$ =>
    todoid$.pipe(
      concatMap(todoid =>
        this.modalService.showConfirmDialog('Delete the TODO?').pipe(
          filter(data => data.decision),
          tap(() => this.deleteTodo(todoid)),
          catchError(this.handleError)
        )
      )
    )
  );

  constructor(
    private readonly todoService: TodoService,
    private readonly modalService: ModalService
  ) {
    super(defaultState);
    this.fetchTodos();
  }

  private handleError(err: Error) {
    console.error(err);
    return EMPTY;
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
