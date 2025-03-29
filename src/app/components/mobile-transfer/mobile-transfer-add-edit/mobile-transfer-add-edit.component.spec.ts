import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTransferAddEditComponent } from './mobile-transfer-add-edit.component';

describe('MobileTransferAddEditComponent', () => {
  let component: MobileTransferAddEditComponent;
  let fixture: ComponentFixture<MobileTransferAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTransferAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTransferAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
