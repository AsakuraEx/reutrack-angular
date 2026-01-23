import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ReunionService } from '../../services/reunion.service';
import { ListaEventosModalComponent } from './components/lista-eventos-modal/lista-eventos-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioService } from '../../services/usuario.service';
import { NuevaReunionComponent } from '../reuniones-view/components/nueva-reunion/nueva-reunion.component';

@Component({
  selector: 'app-programacion-view',
  imports: [
    MatButtonModule, MatIconModule, MatSelectModule, MatInputModule, MatFormFieldModule,
    FullCalendarModule, ReactiveFormsModule, MatAutocompleteModule, AsyncPipe
  ],
  templateUrl: './programacion-view.component.html',
  styleUrl: './programacion-view.component.css'
})
export class ProgramacionViewComponent implements OnInit {

  constructor(
    private reunionService: ReunionService,
    private usuarioService: UsuarioService
  ) {}

  readonly dialog = inject(MatDialog);

  usuario!:any;
  
  reuniones: any[] = [];

  estados:any = {
    Iniciado: 'bg-yellow-500',
    Finalizado: 'bg-blue-500',
    Cancelado: 'bg-red-500',
    Programado: 'bg-purple-500'
  }

  opcionesCalendario: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    headerToolbar: {
      left: 'prev,today,next',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    dayMaxEvents: true,
    buttonText: {
      today: 'hoy',
      month: 'mes',
      week: 'semana',
      day: 'día'
    },
    locale: 'es',
    eventColor: 'oklch(49.6% 0.265 301.924)',
    events: []
  }

  filtroForm = new FormGroup({
    responsable: new FormControl<number | null>(null),
    estado: new FormControl<number | null>(null)
  })

  options: any[] = [];
  filteredOptions!: Observable<any[]>

  onSubmit(): void {
    const estado = Number(this.filtroForm.controls['estado'].value) || null;
    const usuario: any = this.filtroForm.controls['responsable'].value || null; 

    let id_usuario: number | null = null;
    if(usuario) {
      id_usuario = usuario.id;
    }

    this.cargarReuniones(estado, id_usuario);
  }

  ngOnInit(): void {

    const token = localStorage.getItem('token');
    if(token){
      const decoded: any = jwtDecode(token);
      this.usuario = decoded;
    }    
      if(this.usuario.id_rol === 1){
        this.obtenerUsuarios();
        this.configurarAutocomplete()
      }

      this.cargarReuniones();
  }

  programarReunion(): void {
    const dialogRef = this.dialog.open(NuevaReunionComponent, {
        data: {
          usuario: this.usuario,
          programacion: true
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }

    })
  }


  agregarEncargadoInicial(codigo: string): void {

    const token = localStorage.getItem('token');

    let id_reunion: number = 0;
    this.reunionService.obtenerReunionPorCodigo(codigo).subscribe({
      next: (res) => {

        console.log(res)
        id_reunion = res.id

        if(token){
          const decoded: any = jwtDecode(token);
          
          const data: any = {
            id_usuario: decoded.id,
            id_reunion: id_reunion,
            visitante: false
          }

          this.reunionService.agregarResponsables(data).subscribe({
            next: (res) => {
              console.log(res)
            },
            error: (err) => {
              console.log(err)
            }
          })
        }
      }
    })


  }


  handleDateClick(arg: DateClickArg) {
    //alert('Has seleccionado la fecha: ' + arg.dateStr)

    const eventos = arg.view.calendar.getEvents();

    let eventosFiltrados = eventos.filter(evento => {
      return evento.startStr.substring(0, 10) === arg.dateStr.substring(0, 10);
    })

    // eventosFiltrados.forEach(evento => {
      
    //   console.log(`Evento ID: ${evento.id}, Título: ${evento.title}, Fecha: ${evento.startStr.substring(0,10)}`);

    // })

    const dialogRef =this.dialog.open(ListaEventosModalComponent, {
      data: {
        eventosFiltrados,
        fechaSeleccionada: arg.dateStr
      },
      minWidth: '850px',
      maxHeight: '90vh'
    })

    dialogRef.afterClosed().subscribe(result=>{
      // Acción a realizar despues de cerrar el modal
    })

  }

  cargarReuniones(estado?: number | null, usuario?: number | null): void {

    let id_usuario: number | null;
    let id_estado: number | null;

    id_estado = null;
    if(estado) {
      id_estado = estado;
    }

    if(this.usuario.id_rol === 1){
    
      id_usuario = null;
      if(usuario){
        id_usuario = usuario;
      }

    } else {
      id_usuario = this.usuario.id;
    }

    this.reunionService.obtenerReuniones(id_estado, null, null, null, id_usuario, 1, null, null).subscribe({
      next: response => {
        this.reuniones = response.data

        this.opcionesCalendario.events = this.reuniones.map(reuniones => ({
          id: reuniones.id,
          title: reuniones.nombre,
          date: reuniones.createdAt,
          estado: reuniones.estado.nombre,
          programa: reuniones.user.nombre,
          proyecto: reuniones.version.proyecto.nombre,
          version: reuniones.version.nombre,
          codigo: reuniones.codigo,
          virtual: reuniones.virtual,
          color: this.obtenerColorEvento(reuniones.estado.nombre) || 'oklch(49.6% 0.265 301.924)'
        }));
      },
      error: err => {
        this.reuniones = [];
        this.opcionesCalendario.events = [];
      }
    })
  }


  obtenerColorEvento(estado: string): string {
    switch (estado) {
      case 'Cancelado':
        return 'red';
      case 'Finalizado':
        return 'blue';
      case 'Programado':
        return 'oklch(49.6% 0.265 301.924)';
      default:
        return 'orange';
    }
  }

  claseEstado (estado: string): string {
    return `${ this.estados[estado] }`
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
    this.filteredOptions = this.filtroForm.controls['responsable'].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string'){
          return value ? this._filtrarNombres(value) : this.options.slice()
        }

        return this.options.slice()
      })
    );
  } 


}
