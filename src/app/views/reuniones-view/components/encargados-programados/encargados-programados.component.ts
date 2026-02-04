import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReunionService } from '../../../../services/reunion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-encargados-programados',
  imports: [
    MatButtonModule, MatInputModule, MatAutocompleteModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, AsyncPipe
  ],
  templateUrl: './encargados-programados.component.html',
  styleUrl: './encargados-programados.component.css'
})
export class EncargadosProgramadosComponent implements OnInit {

  constructor(
    private reunionService: ReunionService,
    private usuarioService: UsuarioService,
    private toastService: HotToastService
  ) {}

  @Input() reunionProgramada: any = {};
  @Input() verEncargados: boolean = false;
  @Output() verLista = new EventEmitter<boolean>();

  cdk = inject(ChangeDetectorRef)

  responsableForm = new FormGroup({
    id_usuario: new FormControl<any>(null, [Validators.required]),
    id_reunion: new FormControl(0, [Validators.required]),
    visitante: new FormControl<boolean | null>(null, [Validators.required])
  });

  ngOnInit(): void {
    setTimeout(()=>{
      this.obtenerEncargados();
    }, 500);
    this.obtenerUsuarios();
    this.configurarAutocomplete();
  }

  encargados: any[] = [];
  options: any[] = [];
  filteredOptions!: Observable<any[]>;

  obtenerEncargados(): void {
    this.reunionService.obtenerResponsablesPorReunion(this.reunionProgramada.id).subscribe({

      next: (response) => {
        this.encargados = response;
        this.cdk.detectChanges();
      }


    })
  }

  eliminarResponsable (id_encargado: number): void {
    
    this.reunionService.eliminarResponsable(id_encargado).subscribe({
      next: (response) => {
        this.obtenerEncargados();
        this.cdk.detectChanges();
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

  onSubmit(): void {
    if(this.responsableForm.controls['id_usuario'].value){
      this.responsableForm.controls['id_usuario'].setValue(this.responsableForm.controls['id_usuario'].value.id)
    }
    this.responsableForm.controls['id_reunion'].setValue(this.reunionProgramada.id);
    this.responsableForm.controls['visitante'].setValue(false);

    if(this.responsableForm.valid) {
      this.reunionService.agregarResponsables(this.responsableForm.value).subscribe({
        next: (response) => {
          this.obtenerEncargados();
          this.cdk.detectChanges();
          this.toastService.success('Responsable agregado con éxito', {
            duration: 3000,
            position: 'top-right'
          });
        },
        error: (error) => {
          this.toastService.error("No fue posible agregar al encargado", {
            duration: 3000,
            position: 'top-right'
          });
        }
      })
    }
  }

  regresarLista(): void {
    this.verLista.emit(false);
  }

}
