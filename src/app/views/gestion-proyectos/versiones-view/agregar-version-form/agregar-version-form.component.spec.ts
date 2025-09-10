import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVersionFormComponent } from './agregar-version-form.component';

describe('AgregarVersionFormComponent', () => {
  let component: AgregarVersionFormComponent;
  let fixture: ComponentFixture<AgregarVersionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarVersionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarVersionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
