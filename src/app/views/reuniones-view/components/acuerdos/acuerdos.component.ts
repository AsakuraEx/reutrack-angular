import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-acuerdos',
  imports: [
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatCardModule
  ],
  templateUrl: './acuerdos.component.html',
  styleUrl: './acuerdos.component.css'
})
export class AcuerdosComponent {

  expandirPanel = false;

  expandirAcuerdos(): void {
    this.expandirPanel = !this.expandirPanel
  }

}
