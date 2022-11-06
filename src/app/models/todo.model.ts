export interface ITodo {
  todoid: string;
  createdon: string;
  duedate: string;
  text: string;
  status: 'Incomplete' | 'Complete';
  displaydate?: string | undefined;
}
