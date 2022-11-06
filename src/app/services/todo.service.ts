import { Injectable } from '@angular/core';
import { ITodo } from '../models/todo.model';
import { AddTodo, UpdateTodo } from '../types/todo.type';
import { DateService } from './date.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(
    private readonly storage: StorageService,
    private readonly dates: DateService
  ) {}

  addTodo(todo: AddTodo) {
    const createdonUTC = this.dates.getStorageDate(todo.createdon);
    const duedateUTC = this.dates.getStorageDate(todo.duedate);
    return this.storage.addItem<ITodo>({
      ...todo,
      todoid: this.generateTodoId(),
      ...(createdonUTC && { createdon: createdonUTC }),
      ...(duedateUTC && { duedate: duedateUTC })
    });
  }

  updateTodo(todoid: ITodo['todoid'], todo: UpdateTodo) {
    return this.storage.updateItem<ITodo, UpdateTodo>('todoid', todoid, todo);
  }

  deleteTodo(todoid: ITodo['todoid']) {
    return this.storage.deleteItem<ITodo>('todoid', todoid);
  }

  async getTodos() {
    const storedTodos = await this.storage.getItems<ITodo>();
    return storedTodos
      .map(todo => {
        const createdonLocal = this.dates.getDisplayDate(todo.createdon);
        const duedateLocal = this.dates.getDisplayDate(todo.duedate);
        return {
          ...todo,
          ...(createdonLocal && { createdon: createdonLocal }),
          ...(duedateLocal && { duedate: duedateLocal })
        };
      })
      .sort(
        (todo1, todo2) => +new Date(todo1.duedate) - +new Date(todo2.duedate)
      );
  }

  async findTodos(conditions: ((item: ITodo) => boolean)[]) {
    try {
      const todos = await this.getTodos();
      if (todos) {
        let filteredTodos = [...todos];
        for (const condition of conditions) {
          filteredTodos = filteredTodos?.filter(condition);
        }
        return filteredTodos;
      }
      return [];
    } catch (err) {
      throw new Error('err');
    }
  }

  clearTodos() {
    return this.storage.removeAll();
  }

  private generateTodoId() {
    return btoa(`${+new Date()}`)
      .slice(0, -2)
      .toLowerCase();
  }
}
