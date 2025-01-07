import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPortalComponent } from './view-portal.component';

describe('ViewPortalComponent', () => {
  let component: ViewPortalComponent;
  let fixture: ComponentFixture<ViewPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
