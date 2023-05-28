import { ITodo } from '@models';

export type AddTodo = Pick<ITodo, 'heading' | 'text' | 'duedate'>;

export type UpdateTodo = Pick<
  ITodo,
  'heading' | 'text' | 'status' | 'duedate' | 'completedon'
>;

export type GroupedTodo = {
  datedivider: string;
  pending: number;
  todos: ITodo[];
};

export type GroupBy = 'month' | 'day';
