import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashbackListComponent } from './cashback-list.component';

describe('CashbackListComponent', () => {
  let component: CashbackListComponent;
  let fixture: ComponentFixture<CashbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashbackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
