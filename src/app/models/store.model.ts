import { GroupBy, GroupedTodo } from './../types';

export interface ITodoState {
  todos: GroupedTodo[];
  showAll: boolean;
  groupBy: GroupBy;
  searchString: string | undefined | null;
}
