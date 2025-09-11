import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { options } from '../../config/sidebar-menu';
import { MatDialog } from '@angular/material/dialog';
import { NuevaReunionComponent } from '../../views/reuniones-view/components/nueva-reunion/nueva-reunion.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  usuario!:any;
  navbarVisible = false;
  menuOptions = options;

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(NuevaReunionComponent, {
      data: {usuario: this.usuario},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true) {
        console.log('Reunión creada');
      }
    })
  }

  mostrarNavbar() {
    this.navbarVisible = !this.navbarVisible;
  }

  toggleDropDown(id:string) {
    const dropdown = document.getElementById(id);

    if(!dropdown) return;

    dropdown.classList.toggle('max-h-10');
    dropdown.classList.toggle('max-h-96');
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token){
      const decoded = jwtDecode(token);
      this.usuario = decoded;
    }
  }

}
