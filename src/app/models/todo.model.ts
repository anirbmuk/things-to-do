export interface ITodo {
  todoid: string;
  duedate: string;
  heading: string;
  text: string | undefined;
  status: 'Incomplete' | 'Complete';
  additional?: {
    state?: 'error' | 'warn' | 'info' | 'safe';
    message?: string;
    remaining: number | undefined;
  };
}
