import { ITodo } from '../models/todo.model';

export type AddTodo = Omit<ITodo, 'todoid'>;

export type UpdateTodo = Pick<ITodo, 'heading' | 'text' | 'status' | 'duedate'>;

export type GroupedTodo = { datedivider: string; todos: ITodo[] };

export type GroupBy = 'month' | 'day';
