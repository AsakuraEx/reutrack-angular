import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detalle-view',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './detalle-view.component.html',
  styleUrl: './detalle-view.component.css'
})
export class DetalleViewComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private reunionService: ReunionService
  ){}

  loadingPdf: boolean = false;
  reunionVisualizada: any = null;
  pdfUrl: any = null

  ngOnInit(): void {
      this.obtenerDetalleDeReunion()
  }

  obtenerDetalleDeReunion(): void {
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.reunionService.obtenerDetalleReunion(Number(id)).subscribe({
        next: response => {
          this.reunionVisualizada = response
          console.log(response)
        },
        error: err => {
          console.error(err)
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
          console.log(response)
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

}
