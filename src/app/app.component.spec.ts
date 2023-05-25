import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';

import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';

class MockSwUpdate {
  versionUpdates = new BehaviorSubject<boolean>(true).asObservable();
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, MatDialogModule, RouterTestingModule],
      providers: [{ provide: SwUpdate, useFactory: () => new MockSwUpdate() }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AppComponent', () => {
    expect(component).toBeDefined();
  });
});
