import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferAddEditComponent } from './fund-transfer-add-edit.component';

describe('FundTransferAddEditComponent', () => {
  let component: FundTransferAddEditComponent;
  let fixture: ComponentFixture<FundTransferAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundTransferAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
