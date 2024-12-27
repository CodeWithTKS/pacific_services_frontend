import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionAddEditComponent } from './commission-add-edit.component';

describe('CommissionAddEditComponent', () => {
  let component: CommissionAddEditComponent;
  let fixture: ComponentFixture<CommissionAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
