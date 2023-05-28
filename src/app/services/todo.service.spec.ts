import { TestBed } from '@angular/core/testing';
import { ITodo } from '../models/todo.model';
import { AddTodo } from '../types/todo.type';
import { CrudService } from './crud.service';
import { DateService } from './date.service';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let mockCrudService: jasmine.SpyObj<CrudService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let todoService: TodoService;
  const todoToBeAdded: AddTodo = {
    heading: 'Test TODO heading',
    text: 'Test TODO text',
    duedate: '2023-12-31T15:30:00'
  } as const;
  const todoCreatedOrUpdatedOrDeleted: ITodo = {
    heading: 'Test TODO heading',
    text: 'Test TODO text',
    duedate: '2023-12-31T15:30:00.000Z',
    todoid: 'a1b2c3d4e5',
    status: 'Incomplete'
  } as const;

  beforeEach(() => {
    mockCrudService = jasmine.createSpyObj<CrudService>('CrudService', [
      'create',
      'update',
      'delete'
    ]);
    mockDateService = jasmine.createSpyObj<DateService>('DateService', [
      'getStorageDate'
    ]);
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: CrudService, useValue: mockCrudService },
        { provide: DateService, useValue: mockDateService }
      ]
    });
    todoService = TestBed.inject(TodoService);
  });

  it('should add a TODO', async () => {
    mockCrudService.create.and.resolveTo(todoCreatedOrUpdatedOrDeleted);
    const result = await todoService.addTodo(todoToBeAdded);

    expect(mockDateService.getStorageDate).toHaveBeenCalled();
    expect(result?.heading).toBe(todoToBeAdded.heading);
  });

  it('should update a TODO', async () => {
    await todoService.updateTodo({
      todoid: 'todo-to-be-deleted-id',
      todo: todoCreatedOrUpdatedOrDeleted
    });
    expect(mockCrudService.update).toHaveBeenCalled();

    // TODO: find out why mockCrudService.update.and.resolveTo(todoCreatedOrUpdatedOrDeleted); is not working
  });

  it('should delete a TODO', async () => {
    await todoService.deleteTodo('todo-to-be-deleted-id');
    expect(mockCrudService.delete).toHaveBeenCalled();

    // TODO: find out why mockCrudService.delete.and.resolveTo(todoCreatedOrUpdatedOrDeleted); is not working
  });
});
