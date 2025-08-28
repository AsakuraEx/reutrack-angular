import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ReunionService } from '../../../../services/reunion.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { jwtDecode } from 'jwt-decode';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-responsables',
  imports: [
    MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatTableModule,
    MatIconModule, ReactiveFormsModule, AsyncPipe
  ],
  templateUrl: './responsables.component.html',
  styleUrl: './responsables.component.css'
})
export class ResponsablesComponent implements OnInit{

  constructor(
    private reunionService: ReunionService,
    private usuarioService: UsuarioService,
    private toastService: HotToastService
  ) {}

  dataSource = []
  displayedColumns: string[] = ['nombre', 'acciones'];

  decoded!: any;

  options: any[] = [];
  filteredOptions!: Observable<any[]>

  @Input() id_reunion!: number;
  @Input() reunion_reactivada!: boolean;
  @Input() id_usuario_reunion!: number;

  responsableForm = new FormGroup({
    id_usuario: new FormControl<any>(null, [Validators.required]),
    id_reunion: new FormControl(0, [Validators.required]),
    visitante: new FormControl<boolean | null>(null, [Validators.required])
  });

  ngOnInit(): void {

    this.obtenerResponsables(this.id_reunion);
    this.obtenerUsuarios()
    this.configurarAutocomplete()

    const token = localStorage.getItem('token')
    if(token) {
      this.decoded = jwtDecode(token);
    }

  }

  obtenerResponsables(id_reunion: number): void {
    this.reunionService.obtenerResponsablesPorReunion(id_reunion).subscribe({
      next: (response) => {
        this.dataSource = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios(4, null, 1).subscribe({
      next: (response) => {
        this.options = response.data;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    })
  }

  displayNombre(user: any): string {
    return user && user.nombre ? user.nombre : '';
  }

  private _filtrarNombres(nombre: string): any[] {
    const filterValue = nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue))
  }

  configurarAutocomplete(): void {
    this.filteredOptions = this.responsableForm.controls['id_usuario'].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string'){
          return value ? this._filtrarNombres(value) : this.options.slice()
        }

        return this.options.slice()
      })
    );
  } 

  onSubmit(reactivada: boolean): void {

    // Asigna el id de la reunión al formulario
    this.responsableForm.controls['id_reunion'].setValue(this.id_reunion)

    // Evalua si el campo tomó algun valor de la lista
    if(this.responsableForm.controls['id_usuario'].value){
      // En caso que lo tomara, asigna el valor id del objeto al campo
      this.responsableForm.controls['id_usuario'].setValue(this.responsableForm.controls['id_usuario'].value.id)
    }

    // Evalua si la reunión esta reactivada
    if(reactivada){
      // Marca al responsable como visitante en caso que si esté reactivada
      this.responsableForm.controls['visitante'].setValue(true)
    }else{
      // Indica que el responsable no es un visitante
      this.responsableForm.controls['visitante'].setValue(false) 
    }

    // Una vez que esté valido el formulario, realiza el guardado
    if(this.responsableForm.valid){

      this.reunionService.agregarResponsables(this.responsableForm.value).subscribe({
        next: () => {
          this.obtenerResponsables(this.id_reunion);
          this.responsableForm.reset();
          this.responsableForm.markAsUntouched();
          this.responsableForm.markAsPristine();
          this.toastService.success('Responsable agregado con éxito', {
            duration: 3000,
            position: 'top-right'
          });
        },
        error: (err) => {
          this.toastService.error(err.error.error, {
            duration: 3000,
            position: 'top-right'
          });
        }

      })
    }
  }

  eliminarResponsable (id_encargado: number): void {
    
    this.reunionService.eliminarResponsable(id_encargado).subscribe({
      next: (response) => {
        this.obtenerResponsables(this.id_reunion);
        this.toastService.success('Responsable eliminado con éxito', {
          duration: 3000,
          position: 'top-right'
        });
      },
        error: (err) => {
          this.toastService.error("No fue posible eliminar al encargado", {
            duration: 3000,
            position: 'top-right'
          });
        }
    })

  }

}
