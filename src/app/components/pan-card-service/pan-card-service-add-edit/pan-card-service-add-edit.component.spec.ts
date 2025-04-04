import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanCardServiceAddEditComponent } from './pan-card-service-add-edit.component';

describe('PanCardServiceAddEditComponent', () => {
  let component: PanCardServiceAddEditComponent;
  let fixture: ComponentFixture<PanCardServiceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanCardServiceAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanCardServiceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
