import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-detalle-view',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './detalle-view.component.html',
  styleUrl: './detalle-view.component.css'
})
export class DetalleViewComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private reunionService: ReunionService,
    private sanitizer: DomSanitizer,
    private toastService: HotToastService
  ){}

  loadingReunion: boolean = false;
  loadingPdf: boolean = false;
  loadingPdf2: boolean = false;
  reunionVisualizada: any = null;
  pdfUrl: any = null;

  minutaSanitizada: SafeHtml | null = null;

  ngOnInit(): void {
      this.obtenerDetalleDeReunion()
  }

  obtenerDetalleDeReunion(): void {
    
    this.loadingReunion = true;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.reunionService.obtenerDetalleReunion(Number(id)).subscribe({
        next: response => {
          this.reunionVisualizada = response
          this.minutaSanitizada = this.sanitizer.bypassSecurityTrustHtml(this.reunionVisualizada?.minutadereunion[0].minuta || '');
          this.loadingReunion = false;
        },
        error: err => {
          console.error(err)
          this.loadingReunion = false;
        }
      })
    }) 
  
  }

  mostrarPdf() {

    this.loadingPdf = true

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.reunionService.generarPDF(Number(id)).subscribe({
        next: response => {
          this.pdfUrl = URL.createObjectURL(response);
          window.open(this.pdfUrl, '_blank')
          this.loadingPdf = false;
        },
        error: err => {
          console.error(err)
          this.loadingPdf = false;
        }
      })
    })

  }

  enviarPDF(): void {

    this.loadingPdf2 = true

    let correos: string[] = [];
    let asistencia: any[] = this.reunionVisualizada['asistencia reunion'];
    let encargados: any[] = this.reunionVisualizada['encargado de reunion'];

    encargados.forEach(element => {
      correos.push(element.usuario.email)
    });

    asistencia.forEach(element => {
      correos.push(element.correo)
    });

    const data: any = {
      id: this.reunionVisualizada.id,
      nombre: this.reunionVisualizada.nombre,
      asistentes: correos
    }

    console.log(data)
    this.reunionService.enviarPDF(data).subscribe({
      next: () => {
        this.toastService.success('Se envio el documento a los remitentes', {
          position: 'top-right',
          duration: 3000
        })
        this.loadingPdf2 = false
      },
      error: err => {
        console.error(err)
        this.loadingPdf2 = false
      }
    })


  }

  formatearTelefono (telefono: string): string {
    if (telefono.length > 0 && telefono.length < 9) {
      const cadena = telefono.substring(0, 4) + '-' + telefono.substring(4, 8);
      return cadena;
    } 
    
    else if(telefono.length === 9){
      return telefono;
    } else{
      return telefono;
    }
  }

  formatearDUI (dui: string): string {
    if (dui.length > 0 && dui.length < 10) {
      const cadena = dui.substring(0, 8) + '-' + dui.substring(8,9);
      return cadena;
    } 
    else if(dui.length === 10){
      return dui;
    } else {
      return dui;
    }
  }

}
