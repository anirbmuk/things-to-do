import { GroupBy } from '@types';

export interface ITodoState {
  showAll: boolean;
  groupBy: GroupBy;
  searchString: string | undefined | null;
}
