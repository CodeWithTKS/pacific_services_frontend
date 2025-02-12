import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDeleteComponent } from './service-delete.component';

describe('ServiceDeleteComponent', () => {
  let component: ServiceDeleteComponent;
  let fixture: ComponentFixture<ServiceDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
