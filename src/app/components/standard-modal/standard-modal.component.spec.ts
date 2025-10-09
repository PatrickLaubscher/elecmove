import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardModalComponent } from './standard-modal.component';

describe('StandardModalComponent', () => {
  let component: StandardModalComponent;
  let fixture: ComponentFixture<StandardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
