import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferlistComponent } from './fund-transferlist.component';

describe('FundTransferlistComponent', () => {
  let component: FundTransferlistComponent;
  let fixture: ComponentFixture<FundTransferlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundTransferlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
