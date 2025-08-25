import { Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-responsables',
  imports: [
    MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatTableModule,
    MatIconModule
  ],
  templateUrl: './responsables.component.html',
  styleUrl: './responsables.component.css'
})
export class ResponsablesComponent {

  dataSource = [ {nombre: 'Francisco'}, {nombre: 'Josue'} ]
  displayedColumns: string[] = ['nombre', 'acciones'];

  options: string[] = ['One', 'Two', 'Three'];

  eliminarResponsable (element: any): void {
    alert('Eliminar responsable');
  }

}
