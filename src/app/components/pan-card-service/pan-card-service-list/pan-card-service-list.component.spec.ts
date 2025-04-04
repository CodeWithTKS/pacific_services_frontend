import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanCardServiceListComponent } from './pan-card-service-list.component';

describe('PanCardServiceListComponent', () => {
  let component: PanCardServiceListComponent;
  let fixture: ComponentFixture<PanCardServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanCardServiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanCardServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
