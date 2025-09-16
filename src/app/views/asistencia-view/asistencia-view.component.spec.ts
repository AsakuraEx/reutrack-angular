import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaViewComponent } from './asistencia-view.component';

describe('AsistenciaViewComponent', () => {
  let component: AsistenciaViewComponent;
  let fixture: ComponentFixture<AsistenciaViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
