import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AepsListComponent } from './aeps-list.component';

describe('AepsListComponent', () => {
  let component: AepsListComponent;
  let fixture: ComponentFixture<AepsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AepsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AepsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
