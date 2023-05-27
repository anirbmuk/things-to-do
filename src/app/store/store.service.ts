import { inject, Injectable } from '@angular/core';
import { ModalService } from '@modals';
import { ITodo, ITodoState } from '@models';
import { ComponentStore } from '@ngrx/component-store';
import { StorageService, TodoService } from '@services';
import { AddTodo, GroupBy, GroupedTodo, UpdateTodo } from '@types';
import { BehaviorSubject, combineLatest, EMPTY, from } from 'rxjs';
import { catchError, concatMap, filter, switchMap, tap } from 'rxjs/operators';

const defaultState: ITodoState = {
  showAll: false,
  groupBy: 'day',
  searchString: ''
} as const;

const OPERATORS = ['eq', '<', '>', '>=', '<='];

@Injectable({
  providedIn: 'root'
})
export class StoreService extends ComponentStore<ITodoState> {
  private readonly todoService = inject(TodoService);
  private readonly modalService = inject(ModalService);
  private readonly storageService = inject(StorageService);

  private readonly groupedtodos = new BehaviorSubject<GroupedTodo[]>([]);
  readonly groupedtodos$ = this.groupedtodos.asObservable();

  private readonly totalPending = new BehaviorSubject<number>(0);
  readonly totalPending$ = this.totalPending.asObservable();

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
      const tempConditions: ((item: ITodo) => boolean)[] = [];
      if (OPERATORS.some((operator) => searchString.includes(operator))) {
        hasOperator = true;
        OPERATORS.forEach((operator) => {
          if (searchString.includes(operator)) {
            const values = searchString.split(operator);
            if (values.length === 2) {
              const [, value] = values;
              const comparator = value?.trim() ? +value.trim() : undefined;
              if (
                comparator !== null &&
                comparator !== undefined &&
                !isNaN(comparator)
              ) {
                const compareConditions = this.getCompareConditions(
                  operator,
                  comparator
                );
                compareConditions && tempConditions.push(compareConditions);
              }
            }
          }
        });
        hasOperator = !!tempConditions.length;
        conditions.push(...tempConditions);
      }
      !hasOperator &&
        conditions.push(
          (item: ITodo) =>
            item.text?.toLowerCase().includes(searchString) ||
            item.heading.toLowerCase().includes(searchString) ||
            item.additional?.message?.toLowerCase()?.includes(searchString) ||
            item.performance?.message?.toLowerCase()?.includes(searchString) ||
            false
        );
    }
    return conditions;
  });

  readonly filteredTodos$ = combineLatest([
    this.groupBy$,
    this.conditions$
  ]).pipe(
    switchMap(([groupByClause, conditions]) =>
      from(this.todoService.getTodos(groupByClause, conditions)).pipe(
        catchError(() => EMPTY)
      )
    )
  );

  readonly fetchTodos = this.effect<void>((param$) =>
    param$.pipe(
      switchMap(() =>
        this.filteredTodos$.pipe(
          tap(({ pending, groupedTodos }) => {
            this.updateTodos(groupedTodos);
            this.updateCount(pending);
          })
        )
      )
    )
  );

  private updateTodos = (todos: GroupedTodo[]) => this.groupedtodos.next(todos);
  private updateCount = (pending: number) => this.totalPending.next(pending);

  readonly updateShowAll = this.updater(
    (state: ITodoState, showAll: boolean) => {
      this.storageService.setItem('showall', showAll);
      return {
        ...state,
        showAll
      };
    }
  );

  readonly updateSearchString = this.updater(
    (state: ITodoState, searchString: string | undefined | null) => ({
      ...state,
      searchString: searchString?.toLowerCase()
    })
  );

  readonly updateGroupBy = this.updater(
    (state: ITodoState, groupBy: GroupBy) => {
      this.storageService.setItem('groupby', groupBy);
      return {
        ...state,
        groupBy
      };
    }
  );

  readonly addTodo = this.effect<AddTodo>((param$) =>
    param$.pipe(
      concatMap((param) =>
        from(this.todoService.addTodo(param)).pipe(
          tap(() => this.fetchTodos()),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly addTodoModal = this.effect<void>((param$) =>
    param$.pipe(
      concatMap(() =>
        this.modalService.showCreateUpdateDialog('create').pipe(
          filter((data) => data.decision),
          tap((data) => {
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
  }>((param$) =>
    param$.pipe(
      concatMap((param) =>
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
  }>((param$) =>
    param$.pipe(
      concatMap((param) =>
        this.modalService
          .showCreateUpdateDialog('update', { ...param.todo })
          .pipe(
            filter((data) => data.decision),
            tap((data) => {
              const dataToBeUpdated = { ...data.output } as UpdateTodo;
              this.updateTodo({ todoid: param.todoid, todo: dataToBeUpdated });
            }),
            catchError(this.handleError)
          )
      )
    )
  );

  readonly deleteTodo = this.effect<ITodo['todoid']>((todoid$) =>
    todoid$.pipe(
      concatMap((todoid) =>
        from(this.todoService.deleteTodo(todoid)).pipe(
          tap(() => this.fetchTodos()),
          catchError(this.handleError)
        )
      )
    )
  );

  readonly deleteTodoWithConfirmation = this.effect<ITodo['todoid']>(
    (todoid$) =>
      todoid$.pipe(
        concatMap((todoid) =>
          this.modalService.showConfirmDialog('Delete the TODO?').pipe(
            filter((data) => data.decision),
            tap(() => this.deleteTodo(todoid)),
            catchError(this.handleError)
          )
        )
      )
  );

  constructor() {
    const storageService = inject(StorageService);
    const groupBy = JSON.parse(
      storageService.getItem('groupby') || '"day"'
    ) as GroupBy;
    const showAll =
      JSON.parse(storageService.getItem('showall') || 'false') === true;
    super({
      ...defaultState,
      groupBy,
      showAll
    });
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
        return (item: ITodo) =>
          item.additional?.remaining !== null &&
          item.additional?.remaining !== undefined
            ? item.additional?.remaining < comparator
            : false;
      }
      case '>': {
        return (item: ITodo) =>
          item.additional?.remaining !== null &&
          item.additional?.remaining !== undefined
            ? item.additional?.remaining > comparator
            : false;
      }
      case '<=': {
        return (item: ITodo) =>
          item.additional?.remaining !== null &&
          item.additional?.remaining !== undefined
            ? item.additional?.remaining <= comparator
            : false;
      }
      case '>=': {
        return (item: ITodo) =>
          item.additional?.remaining !== null &&
          item.additional?.remaining !== undefined
            ? item.additional?.remaining >= comparator
            : false;
      }
      case 'eq': {
        return (item: ITodo) =>
          item.additional?.remaining !== null &&
          item.additional?.remaining !== undefined
            ? item.additional?.remaining === comparator
            : false;
      }
      default: {
        return;
      }
    }
  }
}
