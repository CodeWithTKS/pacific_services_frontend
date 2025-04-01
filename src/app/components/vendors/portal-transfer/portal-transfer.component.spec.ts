import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalTransferComponent } from './portal-transfer.component';

describe('PortalTransferComponent', () => {
  let component: PortalTransferComponent;
  let fixture: ComponentFixture<PortalTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
