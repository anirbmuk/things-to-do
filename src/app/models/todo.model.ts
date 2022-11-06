export interface ITodo {
  todoid: string;
  duedate: string;
  heading: string;
  text: string;
  status: 'Incomplete' | 'Complete';
}
