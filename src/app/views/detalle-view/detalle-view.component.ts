import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    private sanitizer: DomSanitizer
  ){}

  loadingReunion: boolean = false;
  loadingPdf: boolean = false;
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
