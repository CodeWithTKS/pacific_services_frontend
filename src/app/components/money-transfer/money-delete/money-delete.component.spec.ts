import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyDeleteComponent } from './money-delete.component';

describe('MoneyDeleteComponent', () => {
  let component: MoneyDeleteComponent;
  let fixture: ComponentFixture<MoneyDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
