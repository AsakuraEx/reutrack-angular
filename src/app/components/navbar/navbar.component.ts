import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navbarVisible = false;

  mostrarNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

}
