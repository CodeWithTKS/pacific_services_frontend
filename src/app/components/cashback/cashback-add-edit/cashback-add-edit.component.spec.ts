import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackAddEditComponent } from './cashback-add-edit.component';

describe('CashbackAddEditComponent', () => {
  let component: CashbackAddEditComponent;
  let fixture: ComponentFixture<CashbackAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbackAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashbackAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
