import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ITodo } from '@models';
import { StoreService } from '@store';
import { UpdateTodo } from '@types';
import { TodoComponent } from './todo.component';

class MockNavigator {
  share(params: { text: string; title: string }) {
    return params;
  }
}

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let mockStoreService: StoreService;
  let mockNavigator: MockNavigator;

  beforeEach(waitForAsync(() => {
    mockStoreService = jasmine.createSpyObj<StoreService>(
      'StoreService',
      [
        'updateShowAll',
        'updateGroupBy',
        'updateTodo',
        'updateTodoModal',
        'deleteTodoWithConfirmation'
      ],
      ['groupedtodos$', 'showAll$', 'groupBy$']
    );
    TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [{ provide: StoreService, useValue: mockStoreService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockNavigator = jasmine.createSpyObj<MockNavigator>('MockNavigator', [
      'share'
    ]);
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator
    });
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TodoComponent', () => {
    expect(component).toBeDefined();
  });

  it('should load action and content components', () => {
    const componentElement: HTMLElement = fixture.nativeElement;

    const actionComponent = componentElement.querySelector('ttd-action');
    expect(actionComponent).toBeTruthy();

    const contentComponent = componentElement.querySelector('ttd-content');
    expect(contentComponent).toBeTruthy();
  });

  it('should call the service methods with correct params', () => {
    const param: { todoid: ITodo['todoid']; todo: UpdateTodo } = {
      todoid: 'e5d4c3b2a1',
      todo: {
        duedate: '2020-02-01T20:00:00.000Z',
        heading: 'Second TODO',
        status: 'Incomplete',
        text: 'Text of First TODO'
      }
    };

    component.updateShowAll(true);
    expect(mockStoreService.updateShowAll).toHaveBeenCalledOnceWith(true);

    component.updateStatusAction(param);
    expect(mockStoreService.updateTodo).toHaveBeenCalledOnceWith(param);

    component.updateTodoAction(param);
    expect(mockStoreService.updateTodoModal).toHaveBeenCalledOnceWith(param);

    component.deleteTodoAction('a1b2c3d4e5');
    expect(
      mockStoreService.deleteTodoWithConfirmation
    ).toHaveBeenCalledOnceWith('a1b2c3d4e5');

    component.shareTodoAction('Test data');
    expect(mockNavigator.share).toHaveBeenCalledOnceWith({
      text: 'Test data',
      title: 'Sharing my TODO item'
    });
  });
});
