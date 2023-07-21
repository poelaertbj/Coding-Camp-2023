import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirculatingVariantsComponent } from './circulating-variants.component';

describe('CirculatingVariantsComponent', () => {
  let component: CirculatingVariantsComponent;
  let fixture: ComponentFixture<CirculatingVariantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CirculatingVariantsComponent]
    });
    fixture = TestBed.createComponent(CirculatingVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
