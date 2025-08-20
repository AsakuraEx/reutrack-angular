import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { options } from '../../config/sidebar-menu';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  navbarVisible = false;
  menuOptions = options;

  mostrarNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

}
