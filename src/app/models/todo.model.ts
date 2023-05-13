export interface ITodo {
  todoid: string;
  duedate: string;
  heading: string;
  text: string | undefined;
  status: Status;
  additional?: {
    state?: State;
    message?: string;
    remaining: number | undefined;
  };
  performance?: {
    variation: number;
    rating: Rating;
    message: string;
  };
  completedon?: string | undefined;
}

export type Status = 'Incomplete' | 'Complete';

export type State = 'error' | 'warn' | 'info' | 'safe';

export type Rating = 'beforetime' | 'ontime' | 'late';
