import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionComponent } from './action.component';

const MAT_BUTTON_TOGGLE_GROUP = 'mat-button-toggle-group';
const MAT_BUTTON_TOGGLE_CHECKED = 'mat-button-toggle-checked';

describe('ActionComponent', () => {
  let component: ActionComponent;
  let fixture: ComponentFixture<ActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ActionComponent', () => {
    expect(component).toBeDefined();
  });

  it('should contain 2 labels', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const labels = componentElement.querySelectorAll('label');
    expect(labels?.[0]?.textContent).toContain('Group By');
    expect(labels?.[1]?.textContent).toContain('Completed');
  });

  it('should contain 2 button-toggle groups', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const buttonToggleGroups = componentElement.querySelectorAll(
      MAT_BUTTON_TOGGLE_GROUP
    );
    expect(buttonToggleGroups?.length).toEqual(2);
  });

  it('should contain 2 button-toggles inside each button-toggle group', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const buttonToggleGroups = componentElement.querySelectorAll(
      MAT_BUTTON_TOGGLE_GROUP
    );
    const groupByToggleButtons =
      buttonToggleGroups?.[0].querySelectorAll('mat-button-toggle');
    const completedToggleButtons =
      buttonToggleGroups?.[1].querySelectorAll('mat-button-toggle');

    expect(groupByToggleButtons?.length).toEqual(2);
    expect(groupByToggleButtons?.[0]?.textContent).toContain('Day');
    expect(groupByToggleButtons?.[0]?.classList).toContain(
      MAT_BUTTON_TOGGLE_CHECKED
    );
    expect(groupByToggleButtons?.[1]?.textContent).toContain('Month');
    expect(groupByToggleButtons?.[1]?.classList).not.toContain(
      MAT_BUTTON_TOGGLE_CHECKED
    );

    expect(completedToggleButtons?.length).toEqual(2);
    expect(completedToggleButtons?.[0]?.textContent).toContain('Hide');
    expect(completedToggleButtons?.[0]?.classList).toContain(
      MAT_BUTTON_TOGGLE_CHECKED
    );
    expect(completedToggleButtons?.[1]?.textContent).toContain('Show');
    expect(completedToggleButtons?.[1]?.classList).not.toContain(
      MAT_BUTTON_TOGGLE_CHECKED
    );
  });

  it('should toggle groupBy buttons correctly', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const onToggleGroupBy = spyOn(component, 'onToggleGroupBy');
    const onToggleShowAll = spyOn(component, 'onToggleShowAll');
    const buttonToggleGroups = componentElement.querySelectorAll(
      MAT_BUTTON_TOGGLE_GROUP
    );

    (buttonToggleGroups?.[0] as HTMLElement).click();
    expect(onToggleGroupBy).toHaveBeenCalled();

    (buttonToggleGroups?.[1] as HTMLElement).click();
    expect(onToggleShowAll).toHaveBeenCalled();
  });
});
