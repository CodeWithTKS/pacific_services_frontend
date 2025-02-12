import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAddEditComponent } from './sale-add-edit.component';

describe('SaleAddEditComponent', () => {
  let component: SaleAddEditComponent;
  let fixture: ComponentFixture<SaleAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
