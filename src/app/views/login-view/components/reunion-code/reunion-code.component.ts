import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReunionService } from '../../../../services/reunion.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reunion-code',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './reunion-code.component.html',
  styleUrl: './reunion-code.component.css'
})
export class ReunionCodeComponent {

  constructor(
    private reunionService: ReunionService,
    private toastService: HotToastService,
    private router: Router
  ){}

  formReunion = new FormGroup({
    codigo: new FormControl('')
  })

  onSubmit(): void {
    if(this.formReunion.controls['codigo'].value){

      const codigo = this.formReunion.controls['codigo'].value
      this.reunionService.obtenerReunionPorCodigo(codigo).subscribe({
        next: () => {
          this.toastService.info('A continuacion, complete el formulario para registrar asistencia.', {
            position: 'top-right',
            duration: 5000
          });
          this.router.navigate(['/reunion/asistencia/'+codigo])
        },
        error: e => {
          console.log(e)
          this.toastService.error(e.error.error, {
            position: 'top-right',
            duration: 5000
          })             
        }
      })

    }else {
      this.toastService.error('Para registrar su asistencia debe ingresar un codigo de reunion.', {
        position: 'top-right',
        duration: 3000
      })
      return
    }
  }

}
