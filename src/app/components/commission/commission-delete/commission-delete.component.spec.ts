import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionDeleteComponent } from './commission-delete.component';

describe('CommissionDeleteComponent', () => {
  let component: CommissionDeleteComponent;
  let fixture: ComponentFixture<CommissionDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
