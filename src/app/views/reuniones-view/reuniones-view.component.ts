import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-reuniones-view',
  imports: [
    MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    ResponsablesComponent, AsistenciaComponent, PuntosComponent, AcuerdosComponent,
    AngularEditorModule, ReactiveFormsModule
  ],
  templateUrl: './reuniones-view.component.html',
  styleUrl: './reuniones-view.component.css'
})
export class ReunionesViewComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private proyectoService: ProyectoService,
    private toastService: HotToastService,
    private sanitizer: DomSanitizer // Esto es para evaluar el contenido HTML de manera segura
  ) {}



  contenidoSanitizado: SafeHtml | null = null;  // Variable para almacenar el contenido sanitizado

  esUsuarioLector: boolean = false;

  autoguardadoInterval: any;

  expandReunionActualState = false;
  reunionActualDetails!: ReunionHeader;
  version!: any;

  minutaReunion:any = '';
  contenido = new FormControl('', [Validators.required, Validators.minLength(20)])

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '200px',
    placeholder: 'Escribe aquí...',
    sanitize: false,
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'], // Ocultar botón de imagen
      ['link', 'unlink', 'superscript', 'subscript']
    ]
  }

  ngOnInit(): void {
    this.recuperarReunionActual()

    this.autoguardadoInterval = setInterval(() => {
      this.autoguardado();
    }, 30000);



    this.contenido.valueChanges.subscribe((valor: string | null) => {
      this.contenidoSanitizado = this.sanitizer.bypassSecurityTrustHtml(valor || '');
    });

  }

  ngOnDestroy(): void {
      clearInterval(this.autoguardadoInterval);
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

  autoguardado(): void {

    this.saveSelection();

    if(this.existenCambiosDeReunion()){
      this.guardarReunion();
    } 
  }

  existenCambiosDeReunion(): boolean {
    
    if(!this.contenido.value) return false;
    let texto1 = this.minutaReunion.toString().replace(/(<([^>]+)>)/ig, '');
    let texto2 = this.contenido.value.toString().replace(/(<([^>]+)>)/ig, '');

    if(texto1 !== texto2) return true;
    return false;
    
  }

  async validarUsuarioLector(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded: any = jwtDecode(token);

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
        this.obtenerInformacionVersion()
        this.consultarDesarrolloDeReunion()
      },
      error: (err) => {
        console.error(err);
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
        if(resp.length > 0) {
          const nuevaMinuta = resp[0].minuta;
          const anterior = this.contenido.value;

          this.minutaReunion = nuevaMinuta;

          if (anterior !== nuevaMinuta) {
            this.contenido.setValue(nuevaMinuta);
          } else {
            this.restoreSelection();
          }
      
        }

      },
      error: err => {
        console.log(err)
      }
    })

  }

  async guardarReunion(): Promise<void> {

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

    if(this.contenido.value){
      contador = this.contarLetras(this.contenido.value)
    }else{
      contador = 0;
    }

    if(this.contenido.hasError('minLength') || contador < 20){
      this.toastService.error('El desarrollo de la reunión debe contener al menos 20 carácteres', {
        duration: 3000,
        position: 'top-right'
      })
      return
    }

    const data = {
      minuta: this.contenido.value,
      id_reunion: this.reunionActualDetails.id
    }

    if(!this.minutaReunion){

      this.reunionService.guardarMinutaReunion(data).subscribe({
        next: () => {
          this.toastService.success('La información se guardó hasta este punto' + this.transformarFecha(), {
            position: 'top-right',
            duration: 3000
          })
          this.consultarDesarrolloDeReunion();
          console.log('Guardado efectuado')
          
        },
        error: err => {
          this.toastService.error(err, {
            position: 'top-right',
            duration: 3000
          })
        }
      })

    }

    else{
      this.reunionService.actualizarMinutaReunion(this.reunionActualDetails.id, data).subscribe({
        next: resp => {
          this.toastService.success('La información se actualizó hasta este punto ' + this.transformarFecha(), {
            position: 'top-right',
            duration: 3000
          })
          this.consultarDesarrolloDeReunion();
          console.log('Guardado efectuado')
        },
        error: err => {
          this.toastService.error(err, {
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

    if(this.contenido.value){
      contador = this.contarLetras(this.contenido.value)
    }else{
      contador = 0;
    }

    if(this.contenido.hasError('minLength') || contador < 20){
      this.toastService.error('El desarrollo de la reunión debe contener al menos 20 carácteres', {
        duration: 3000,
        position: 'top-right'
      })
      return
    }

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

    if(this.contenido.value){
      contador = this.contarLetras(this.contenido.value)
    }else{
      contador = 0;
    }

    if(this.contenido.hasError('minLength') || contador < 20){
      this.toastService.error('El desarrollo de la reunión debe contener al menos 20 carácteres', {
        duration: 3000,
        position: 'top-right'
      })
      return
    }

    this.guardarReunion();
    this.consultarDesarrolloDeReunion()
    this.router.navigate(['/'])
  }

  contarLetras(contenido: string): number {
      let texto = contenido.toString().replace(/(<([^>]+)>)/ig, '')
      return texto.length
  }

  transformarFecha(): string  {
      
      const nuevaFecha = new Date()

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

  private savedRange: Range | null = null;

  saveSelection() {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0);
    }
  }

  restoreSelection() {
    if (this.savedRange) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(this.savedRange);
    }
  }

}
