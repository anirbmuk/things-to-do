import { ITodo } from '@models';

export type AddTodo = Omit<ITodo, 'todoid' | 'status'>;

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
