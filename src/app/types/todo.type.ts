import { ITodo } from '../models/todo.model';

export type AddTodo = Omit<ITodo, 'todoid'>;

export type UpdateTodo = Pick<ITodo, 'heading' | 'text' | 'status' | 'duedate'>;
