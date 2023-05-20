import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create NotFoundComponent', () => {
    expect(component).toBeDefined();
  });

  it('should contain h1 tag with 404', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const heading = componentElement.querySelector('h1');
    expect(heading?.textContent).toContain('!404!');
  });

  it('should contain p tag with message', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const heading = componentElement.querySelector('p');
    expect(heading?.textContent).toContain(
      `Sorry, the page you are looking for isn't available.`
    );
  });
});
