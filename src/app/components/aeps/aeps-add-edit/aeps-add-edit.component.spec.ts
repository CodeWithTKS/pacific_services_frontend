import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AepsAddEditComponent } from './aeps-add-edit.component';

describe('AepsAddEditComponent', () => {
  let component: AepsAddEditComponent;
  let fixture: ComponentFixture<AepsAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AepsAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AepsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
