import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalAddEditComponent } from './portal-add-edit.component';

describe('PortalAddEditComponent', () => {
  let component: PortalAddEditComponent;
  let fixture: ComponentFixture<PortalAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortalAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
