import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AepsDeleteComponent } from './aeps-delete.component';

describe('AepsDeleteComponent', () => {
  let component: AepsDeleteComponent;
  let fixture: ComponentFixture<AepsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AepsDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AepsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
