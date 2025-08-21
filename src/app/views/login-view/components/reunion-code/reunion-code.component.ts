import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reunion-code',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './reunion-code.component.html',
  styleUrl: './reunion-code.component.css'
})
export class ReunionCodeComponent {

}
