import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullVacancyComponent } from './full-vacancy.component';

describe('FullVacancyComponent', () => {
  let component: FullVacancyComponent;
  let fixture: ComponentFixture<FullVacancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullVacancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
