import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomepageComponent } from './dashboard-homepage.component';

describe('DashboardHomepageComponent', () => {
  let component: DashboardHomepageComponent;
  let fixture: ComponentFixture<DashboardHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
