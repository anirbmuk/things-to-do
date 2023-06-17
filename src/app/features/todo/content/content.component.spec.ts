import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateService } from '@services';
import { GroupedTodo } from '@types';
import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let mockDateService: DateService;

  let groupedTodos: GroupedTodo[] = [
    {
      datedivider: '2020-01',
      pending: 0,
      todos: [
        {
          additional: undefined,
          performance: {
            rating: 'ontime',
            variation: 0,
            message: 'Completed on time :-)'
          },
          completedon: '2020-01-01T20:00:00.000Z',
          duedate: '2020-01-01T20:00:00.000Z',
          heading: 'First TODO',
          status: 'Complete',
          text: 'Text of First TODO',
          todoid: 'todoid1'
        }
      ]
    },
    {
      datedivider: '2020-02',
      pending: 1,
      todos: [
        {
          additional: {
            remaining: 180,
            state: 'error',
            message: 'Past due date'
          },
          duedate: '2020-02-01T20:00:00.000Z',
          heading: 'Second TODO',
          status: 'Incomplete',
          text: 'Text of First TODO',
          todoid: 'todoid2'
        }
      ]
    }
  ];

  beforeEach(waitForAsync(() => {
    mockDateService = jasmine.createSpyObj<DateService>('DateService', [
      'getStorageFormDateTime'
    ]);

    TestBed.configureTestingModule({
      imports: [ContentComponent],
      providers: [{ provide: DateService, useValue: mockDateService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    component.todos = groupedTodos;
    fixture.detectChanges();
  });

  it('should create ContentComponent', () => {
    expect(component).toBeDefined();
  });

  it('should create a group-by legend', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const legends = componentElement.querySelectorAll('legend');

    expect(legends?.[0]?.textContent).toContain('Jan 2020');
    expect(legends?.[1]?.textContent).toContain('Feb 2020');
    expect(legends?.[1]?.textContent).toContain('1 pending TODO');
  });

  it('should construct the TODO list', () => {
    const componentElement: HTMLElement = fixture.nativeElement;

    const lists = componentElement.querySelectorAll('[todolist]');
    expect(lists.length).toEqual(2);

    const firstTodoStructure = lists?.[0].querySelector('[todolistitem]');
    const heading1 = firstTodoStructure?.querySelector('[todoheading]');
    const text1 = firstTodoStructure?.querySelector('[todotext]');
    const status1 = firstTodoStructure?.querySelector('[todostatus]');
    const additional1 = firstTodoStructure?.querySelector('[todoadditional]');
    const performance1 = firstTodoStructure?.querySelector('[todoperformance]');

    expect(heading1?.textContent).toContain(groupedTodos[0].todos[0].heading);
    expect(text1?.textContent).toContain(groupedTodos[0].todos[0].text);
    expect(status1).toBeNull();
    expect(additional1).toBeNull();
    expect(performance1?.textContent).toContain(
      groupedTodos[0].todos[0].performance?.message
    );

    const secondTodoStructure = lists?.[1].querySelector('[todolistitem]');
    const status2 = secondTodoStructure?.querySelector('[todostatus]');
    const additional2 = secondTodoStructure?.querySelector('[todoadditional]');
    const performance2 =
      secondTodoStructure?.querySelector('[todoperformance]');

    expect(status2?.textContent).toContain('Due: Feb 1, 2020');
    expect(additional2?.textContent).toContain('Past due date');
    expect(performance2).toBeNull();
  });

  it('should toggle status', () => {
    component.toggleStatus(new Event('click'), groupedTodos[0].todos[0]);
    expect(mockDateService.getStorageFormDateTime).not.toHaveBeenCalled();

    component.toggleStatus(new Event('click'), groupedTodos[1].todos[0]);
    expect(mockDateService.getStorageFormDateTime).toHaveBeenCalled();
  });

  it('should render empty list without TODOs', () => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    component.todos = [];
    fixture.detectChanges();
    const componentElement: HTMLElement = fixture.nativeElement;

    const lists = componentElement.querySelectorAll('[todolist]');
    expect(lists?.length).toBe(0);

    const noDataMessage = componentElement.querySelector('.text-red-600');
    expect(noDataMessage?.textContent).toContain('No TODOs found');
  });
});
