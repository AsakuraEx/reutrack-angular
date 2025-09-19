import { Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ListaFuncionalidadesComponent } from '../lista-funcionalidades/lista-funcionalidades.component';
import { ActivatedRoute } from '@angular/router';
import { ActaAceptacionService } from '../../../../services/acta-aceptacion.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-funcionalidades',
  imports: [
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSlideToggleModule, ListaFuncionalidadesComponent, ReactiveFormsModule
  ],
  templateUrl: './funcionalidades.component.html',
  styleUrl: './funcionalidades.component.css'
})
export class FuncionalidadesComponent {

  constructor(
    private route: ActivatedRoute,
    private actaAceptacionService: ActaAceptacionService,
    private toastService: HotToastService,
    private fb: FormBuilder
  ){}

  @ViewChild(FormGroupDirective) formDirective?: FormGroupDirective

  @Input() acta_aceptacion!:any

  id_acta!: number;
  funcionalidades: any[] = [];
  formFuncionalidad = new FormGroup({
    descripcion: new FormControl('', {
      updateOn: 'blur',
      validators: [Validators.required]
    }),
    aprobado: new FormControl(false),
    id_acta: new FormControl(this.id_acta, [Validators.required]),
    cambio_solicitado: new FormControl('')
  })

  ngOnInit(): void {
    this.obtenerFuncionalidadesPorActa()
  }
  
  obtenerFuncionalidadesPorActa(): void {
    this.id_acta = Number(this.route.snapshot.paramMap.get('id_acta'));
    this.actaAceptacionService.obtenerFuncionesPorActa(this.id_acta).subscribe(response => {
      this.funcionalidades = response
    })
  }

  agregarFuncionalidades(): void {

    this.formFuncionalidad.controls['id_acta'].setValue(this.id_acta)
    if(this.formFuncionalidad.valid){

      this.actaAceptacionService.agregarFunciones(this.formFuncionalidad.value).subscribe({
        next: () => {
          this.toastService.success('Se agrego la funcionalidad al acta de aceptación', {
            position: 'top-right',
            duration: 3000
          })
          this.obtenerFuncionalidadesPorActa()
          this.formDirective?.resetForm()
          this.formFuncionalidad.reset()
        },
        error: e => {
          console.log(e)
        }
      })
    }
  }

}
