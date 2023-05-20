import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreService } from '@store';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockTodoService: StoreService;

  beforeEach(waitForAsync(() => {
    mockTodoService = jasmine.createSpyObj<StoreService>('StoreService', [
      'addTodoModal'
    ]);
    TestBed.configureTestingModule({
      imports: [HeaderComponent, MatDialogModule, RouterTestingModule],
      providers: [{ provide: StoreService, useValue: mockTodoService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create HeaderComponent', () => {
    expect(component).toBeDefined();
  });

  it('should have a nav section with title', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const navElement = componentElement.querySelector('nav');
    expect(navElement?.textContent).toContain('Things TODO');
  });

  it('should toggle the search state', () => {
    component.displaySearch();
    expect(component.showSearch)
      .withContext('Search field is shown')
      .toBeTrue();

    component.displaySearch();
    expect(component.showSearch)
      .withContext('Search field is hidden')
      .toBeFalse();
  });

  it('should open the TODO modal', () => {
    component.addTodo();
    expect(mockTodoService.addTodoModal).toHaveBeenCalled();
  });
});
