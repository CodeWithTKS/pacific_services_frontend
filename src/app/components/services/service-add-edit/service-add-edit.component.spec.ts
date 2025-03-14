import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceAddEditComponent } from './service-add-edit.component';

describe('ServiceAddEditComponent', () => {
  let component: ServiceAddEditComponent;
  let fixture: ComponentFixture<ServiceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
