import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyAddEditComponent } from './money-add-edit.component';

describe('MoneyAddEditComponent', () => {
  let component: MoneyAddEditComponent;
  let fixture: ComponentFixture<MoneyAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
