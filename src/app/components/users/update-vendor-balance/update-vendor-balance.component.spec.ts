import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVendorBalanceComponent } from './update-vendor-balance.component';

describe('UpdateVendorBalanceComponent', () => {
  let component: UpdateVendorBalanceComponent;
  let fixture: ComponentFixture<UpdateVendorBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVendorBalanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVendorBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
