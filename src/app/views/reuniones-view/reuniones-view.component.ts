import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ReunionService } from '../../services/reunion.service';
import { ReunionHeader } from '../../models/reunion-header.model';

@Component({
  selector: 'app-reuniones-view',
  imports: [
    MatIconModule, MatButtonModule,
    MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatButtonModule
  ],
  templateUrl: './reuniones-view.component.html',
  styleUrl: './reuniones-view.component.css'
})
export class ReunionesViewComponent implements OnInit {

  constructor(
    private router: Router,
    private reunionService: ReunionService,
    private route: ActivatedRoute
  ) {}

  expandReunionActualState = false;
  reunionActualDetails!: ReunionHeader;

  options: string[] = ['One', 'Two', 'Three'];

  ngOnInit(): void {
   
    this.recuperarReunionActual()

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
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  expandReunionActual (): void {
    this.expandReunionActualState = !this.expandReunionActualState;
  } 

}
