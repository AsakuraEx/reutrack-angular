import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoCancelacionModalComponent } from './motivo-cancelacion-modal.component';

describe('MotivoCancelacionModalComponent', () => {
  let component: MotivoCancelacionModalComponent;
  let fixture: ComponentFixture<MotivoCancelacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoCancelacionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoCancelacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
