import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivarReunionModalComponent } from './reactivar-reunion-modal.component';

describe('ReactivarReunionModalComponent', () => {
  let component: ReactivarReunionModalComponent;
  let fixture: ComponentFixture<ReactivarReunionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactivarReunionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivarReunionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
