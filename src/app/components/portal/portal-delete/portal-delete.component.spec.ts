import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalDeleteComponent } from './portal-delete.component';

describe('PortalDeleteComponent', () => {
  let component: PortalDeleteComponent;
  let fixture: ComponentFixture<PortalDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
