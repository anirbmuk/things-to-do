import { Injectable } from '@angular/core';
import { ITodo } from '../models/todo.model';
import { AddTodo, GroupBy, GroupedTodo, UpdateTodo } from '../types';
import { CrudService } from './crud.service';
import { DateService } from './date.service';

const defaultSort = (todo1: ITodo, todo2: ITodo) =>
  +new Date(todo1.duedate) - +new Date(todo2.duedate);

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(
    private readonly crudService: CrudService,
    private readonly dateService: DateService
  ) {}

  addTodo(todo: AddTodo) {
    const duedateUTC = this.dateService.getStorageDate(todo.duedate);
    return this.crudService.create<ITodo>({
      ...todo,
      todoid: this.generateTodoId(),
      status: 'Incomplete',
      ...(duedateUTC && { duedate: duedateUTC })
    });
  }

  updateTodo(params: { todoid: ITodo['todoid']; todo: UpdateTodo }) {
    return this.crudService.update<ITodo, UpdateTodo>(
      'todoid',
      params.todoid,
      params.todo
    );
  }

  deleteTodo(todoid: ITodo['todoid']) {
    return this.crudService.delete<ITodo>('todoid', todoid);
  }

  private async _getTodos() {
    const storedTodos = await this.crudService.read<ITodo>();
    return storedTodos
      .map((todo) => {
        const additional = this.getAdditionalInfo(todo);
        return {
          ...todo,
          additional
        };
      })
      .sort(defaultSort);
  }

  async getTodos(
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
    return todo.status === 'Incomplete'
      ? this.dateService.getStatus(todo.duedate)
      : undefined;
  }

  clearTodos() {
    return this.crudService.deleteAll();
  }

  private generateTodoId() {
    return btoa(`${+new Date()}-${Math.ceil(Math.random() * 1000)}`)
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
          (todo) =>
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
