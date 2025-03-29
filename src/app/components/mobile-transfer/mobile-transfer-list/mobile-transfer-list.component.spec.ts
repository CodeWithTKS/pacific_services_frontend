import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTransferListComponent } from './mobile-transfer-list.component';

describe('MobileTransferListComponent', () => {
  let component: MobileTransferListComponent;
  let fixture: ComponentFixture<MobileTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileTransferListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
