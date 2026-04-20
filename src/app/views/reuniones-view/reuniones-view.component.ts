import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { ReunionHeader } from '../../models/reunion-header.model';
import { ResponsablesComponent } from './components/responsables/responsables.component';
import { ProyectoService } from '../../services/proyecto.service';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { PuntosComponent } from './components/puntos/puntos.component';
import { AcuerdosComponent } from './components/acuerdos/acuerdos.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ActualizarModalComponent } from './components/actualizar-modal/actualizar-modal.component';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-reuniones-view',
  imports: [
    MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    ResponsablesComponent, AsistenciaComponent, PuntosComponent, AcuerdosComponent,
    AngularEditorModule, ReactiveFormsModule, MatSlideToggleModule, MatSelectModule
  ],
  templateUrl: './reuniones-view.component.html',
  styleUrl: './reuniones-view.component.css'
})
export class ReunionesViewComponent implements OnInit, OnDestroy, AfterViewInit {

  ultimoMensaje: any;
  private socketSubscription!: Subscription;
  private typingTimer: any;
  unUsuarioEscribiendo: boolean = false;
  usuarioEscribiendo: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private proyectoService: ProyectoService,
    private toastService: HotToastService,
    private socketService: SocketService
  ) {}


  esUsuarioLector: boolean = false;

  autoguardadoInterval: any;

  expandReunionActualState = false;
  reunionActualDetails!: ReunionHeader;
  version!: any;

  showModal: boolean = false;

  reunion_id!:number;
  minutaReunion:any = '';

  readonly dialog = inject(MatDialog)

  reunionForm = new FormGroup({
    contenido: new FormControl('', [Validators.required, Validators.minLength(20)]),
    motivo: new FormControl<number | null>(null, [Validators.required]),
    virtual: new FormControl<boolean>(false),
    nombre_reunion: new FormControl(''),
    lugar_reunion: new FormControl('')
  })

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '200px',
    placeholder: 'Escribe aquí la minuta de reunión...',
    sanitize: false,
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'], // Ocultar botón de imagen
      ['link', 'unlink', 'superscript', 'subscript']
    ]
  }

  ngOnInit(): void {
    this.obtenerMotivoReunion();
  }
  
  ngAfterViewInit(): void {
    this.recuperarReunionActual()

    // Crea el intervalo de 30 segundos para ejecutar el guardado de información
    // this.autoguardadoInterval = setInterval(() => {
    //   this.autoguardado();
    // }, 10000);
      
  }

  // Cuando el componente desaparece, se elimina el intervalo
  ngOnDestroy(): void {
      clearInterval(this.autoguardadoInterval);
      sessionStorage.clear();

      if(this.socketSubscription) {
        this.socketSubscription.unsubscribe();
      }
  }

  autoguardado(): void {


    if(!this.minutaReunion){
      console.log('Autoguardado...')
      this.guardarReunion();
    }

    // Solo si existen cambios
    if(this.existenCambiosDeReunion()){

      // Guarda la minuta de reunión
      this.guardarReunion();
      return
    } 
  }

  existenCambiosDeReunion(): boolean {
    
    const contenidoTexto = this.reunionForm.controls['contenido'].value;

    if(!contenidoTexto) return false;
    if(!this.minutaReunion) return false;

    // Se obtiene la minuta de reunión tal cual
    let texto1 = this.minutaReunion.toString().replace(/(<([^>]+)>)/ig, '');

    // Se obtiene el valor del formulario 
    let texto2 = contenidoTexto.toString().replace(/(<([^>]+)>)/ig, '');

    // Si la minuta obtenida es diferente al valor entonces guarda
    if(texto1 !== texto2) {

      // Reemplaza la minuta de reunión
      sessionStorage.setItem('minuta', texto2);

      // Obtengo la minuta recien guardada
      const anterior = sessionStorage.getItem('minuta')

      // La minuta recien guardada se almacena en la variable minuta de reunión
      if(anterior) this.minutaReunion = anterior;

      // Retorna que si existen cambios y ejecuta el guardado
      return true

    } else {

      // Si no hay cambios de información no realiza ninguna acción
      return false;
    };
    
  }

  validarLector(esLector: boolean): void {
    this.esUsuarioLector = esLector;

    if(this.esUsuarioLector === true){
      this.editorConfig = {
        ...this.editorConfig,
        editable: !this.esUsuarioLector
      };
    }
  }


  async validarUsuarioLector(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded: any = jwtDecode(token);

    if(!this.reunionActualDetails){
      return false;
    }

    try {
      const responsables: any[] = await firstValueFrom(
        this.reunionService.obtenerResponsablesPorReunion(this.reunionActualDetails.id)
      );

      if (responsables.length <= 0) return false;

      return responsables.some(
        responsable => responsable.id_usuario === decoded.id && responsable.visitante
      );

    } catch (e) {
      console.error(e);
      return false;
    }
  }

  recuperarReunionActual(): void {
    const codigo = this.route.snapshot.paramMap.get('codigo');

    if(!codigo){
      this.router.navigate(['/']);
      return;
    }

    this.reunionService.obtenerReunionPorCodigo(codigo).subscribe({
      next: (response) => {
        this.reunionActualDetails = response;

        this.obtenerInformacionVersion();
        this.consultarDesarrolloDeReunion();

        if(response.id_motivo) {
          this.reunionForm.controls['motivo'].setValue(response.id_motivo);
        }
        
        this.reunionForm.controls['nombre_reunion'].setValue(this.reunionActualDetails.nombre);
        this.reunionForm.controls['lugar_reunion'].setValue(this.reunionActualDetails.lugar);

        this.reunionForm.controls['virtual'].setValue(this.reunionActualDetails.virtual);

      },
      error: (err) => {
        console.error(err.error.error);
      }
    })
  }

  expandReunionActual (): void {
    this.expandReunionActualState = !this.expandReunionActualState;
  } 

  obtenerInformacionVersion(): void {
    this.proyectoService.obtenerVersion(this.reunionActualDetails.id_version).subscribe({
      next: (response) => {
        this.version = response
      },
      error: (error) => {
        console.error("NO SIRVE" + error);
      }
    })
  }

  consultarDesarrolloDeReunion(): void {

    this.reunionService.consultarMinutaReunion(this.reunionActualDetails.id).subscribe({
      next: resp => {

        if(resp.length === 0){
          this.minutaReunion = null;
          this.reunionForm.controls['contenido'].setValue('', { emitEvent: false });
          return;
        }

        const nuevaMinuta = resp[0].minuta;
        this.minutaReunion = nuevaMinuta;
        this.reunionForm.controls['contenido'].setValue(this.minutaReunion, { emitEvent: false});
        
        this.reunion_id = resp[0].id_reunion;
        this.configurarSocket(this.reunion_id);
      

      },
      error: err => {
        console.log("Error al consultar minuta: " + err)
      }
    })

  }

  configurarSocket(id_reunion: number): void {
    this.socketService.emitirEvento('join-reunion', id_reunion);

    if(this.socketSubscription) {
      return;
    }

    this.socketSubscription = this.socketService.escucharEvento('ver-minuta').subscribe((data) => {
      this.ultimoMensaje = data;

      if (data && data.data) {
        this.reunionForm.controls['contenido'].setValue(data.data, { emitEvent: false });
        this.unUsuarioEscribiendo = false;
      }
    });

    this.socketService.escucharEvento('estado_escritura').subscribe((payload: any) => {
      this.unUsuarioEscribiendo = payload.escribiendo;
      this.usuarioEscribiendo = payload.usuario;
      this.editorConfig.editable = !payload.escribiendo;
    });
  }

  notificarEscritura(id_reunion: number): void {

    const token = localStorage.getItem('token');
    const decoded:any = token ? jwtDecode(token) : null;

    this.socketService.emitirEvento('escribiendo', { minutaId: id_reunion, escribiendo: true, usuario: decoded.nombre });

    clearTimeout(this.typingTimer);
    
    // Si pasan 1.5 segundos sin teclear, enviamos false
    this.typingTimer = setTimeout(() => {
      this.socketService.emitirEvento('escribiendo', { minutaId: id_reunion, escribiendo: false, usuario: decoded.nombre });
    }, 1500);

  }


  async guardarReunion(): Promise<void> {

    if(this.unUsuarioEscribiendo === true) {
      return;
    }

    this.validarUsuarioLector();
    const esLector = await this.validarUsuarioLector();
    if(esLector){
      this.toastService.info('Usted ha ingresado como un usuario lector, no tiene permitido realizar cambios',{
        duration: 3000,
        position: 'top-right'
      })
      return;
    }

    let contador!: number;

    if(this.reunionForm.controls['contenido'].value){
      contador = this.contarLetras(this.reunionForm.controls['contenido'].value)
    }else{
      contador = 0;
    }

    if(this.reunionForm.controls['contenido'].hasError('minLength') || contador < 20){
      return
    }

    if(!this.reunionForm.controls['motivo'].value) {
      this.toastService.error('El campo motivo de reunión es obligatorio', {
        position: 'top-right',
        duration: 3000
      })
      return;
    }

    const isVirtual: number = this.reunionForm.controls['virtual'].value ? 1 : 0;

    const data = {
      minuta: this.reunionForm.controls['contenido'].value,
      id_reunion: this.reunionActualDetails.id,
      id_motivo: this.reunionForm.controls['motivo'].value,
      virtual: isVirtual,
      nombre_reunion: this.reunionForm.controls['nombre_reunion'].value,
      lugar_reunion: this.reunionForm.controls['lugar_reunion'].value
    }

    if(!this.minutaReunion){

      // Aqui se guarda la reunión por primera vez

      this.reunionService.guardarMinutaReunion(data).subscribe({
        next: () => {
          this.toastService.success('La información se guardó hasta este punto ' + this.transformarFecha(), {
            position: 'top-right',
            duration: 3000
          })

          this.minutaReunion = this.reunionForm.controls['contenido'].value;
          
        },
        error: err => {
          this.toastService.error(err.error.error, {
            position: 'top-right',
            duration: 3000
          })
        }
      })

    }

    // Aca se actualiza la información de la reunión

    else{
      this.reunionService.actualizarMinutaReunion(this.reunionActualDetails.id, data).subscribe({
        next: resp => {
          this.toastService.success('La información se actualizó hasta este punto ' + this.transformarFecha(), {
            position: 'top-right',
            duration: 3000
          })
        },
        error: err => {
          this.toastService.error(err.error.error, {
            position: 'top-right',
            duration: 3000
          })
        }
      })
    }

  }

  async finalizarReunion(): Promise<void> {

    this.validarUsuarioLector();
    const esLector = await this.validarUsuarioLector();
    if(esLector){
      this.toastService.info('Usted ha ingresado como un usuario lector, no tiene permitido realizar cambios',{
        duration: 3000,
        position: 'top-right'
      })
      return;
    }

    let contador!: number;

    if(this.reunionForm.controls['contenido'].value){
      contador = this.contarLetras(this.reunionForm.controls['contenido'].value)
    }else{
      contador = 0;
    }

    if(this.reunionForm.controls['contenido'].hasError('minLength') || contador < 20){
      this.toastService.error('El desarrollo de la reunión debe contener al menos 20 carácteres', {
        duration: 3000,
        position: 'top-right'
      })
      return
    }

    if(!this.reunionForm.controls['motivo'].value) {
      this.toastService.error('El campo motivo de reunión es obligatorio para finalizar la reunión', {
        position: 'top-right',
        duration: 3000
      })
      return;
    }

    this.abrirModalActualizarVersion();

  }

  async guardarReunionYSalir(): Promise<void> {

    this.validarUsuarioLector();
    const esLector = await this.validarUsuarioLector();
    if(esLector){
      this.toastService.info('Usted ha ingresado como un usuario lector, no tiene permitido realizar cambios',{
        duration: 3000,
        position: 'top-right'
      })
      return;
    }

    let contador!: number;

    if(this.reunionForm.controls['contenido'].value){
      contador = this.contarLetras(this.reunionForm.controls['contenido'].value)
    }else{
      contador = 0;
    }

    if(this.reunionForm.controls['contenido'].hasError('minLength') || contador < 20){
      this.toastService.error('El desarrollo de la reunión debe contener al menos 20 carácteres', {
        duration: 3000,
        position: 'top-right'
      })
      return
    }

    if(!this.reunionForm.controls['motivo'].value) {
      this.toastService.error('El campo motivo de reunión es obligatorio', {
        position: 'top-right',
        duration: 3000
      })
      return;
    }

    await this.guardarReunion();
    this.consultarDesarrolloDeReunion()
    this.router.navigate(['/'])
  }

  contarLetras(contenido: string): number {
      let texto = contenido.toString().replace(/(<([^>]+)>)/ig, '')
      return texto.length
  }

  transformarFecha(fecha?: string): string  {
      
      const nuevaFecha = new Date(fecha ? fecha : new Date());

      const fechaFormateada = nuevaFecha.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',   // Hora en formato de dos dígitos
          minute: '2-digit', // Minutos en formato de dos dígitos
          second: '2-digit', // Segundos en formato de dos dígitos
          hour12: true
      });

      return fechaFormateada
  }


  abrirModalActualizarVersion(): void {
    const dialogRef = this.dialog.open(ActualizarModalComponent, {
      data: this.version,
      minWidth: '715px',
      minHeight: 'auto'
    })

    this.showModal = true;

    dialogRef.afterClosed().subscribe(result => {

      if(result === true) {
        this.reunionService.finalizarReunion(this.reunionActualDetails.id).subscribe({
          next: () => {
            this.guardarReunion();
            this.toastService.success('La reunión ha finalizado, se cierra el acceso a registro de lista de asistencia', {
              duration: 5000,
              position: 'top-right'
            });
            this.router.navigate(['/historial']);
          },
          error: (err) => {
            this.toastService.error(err, {
              duration: 5000,
              position: 'top-right'
            })
          }
        })
      }
    })
  }


  motivosReunion: any[] = [];

  obtenerMotivoReunion(): void {

    this.reunionService.obtenerMotivosReunion().subscribe({
      next: (response) => {
        this.motivosReunion = response;
      },
      error: (error) => {
        console.error('Error al obtener los motivos de reunión:', error);
      }
    });
  }

}
