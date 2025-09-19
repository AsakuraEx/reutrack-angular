import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenuOpcionesComponent } from "./components/menu-opciones/menu-opciones.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MenuOpcionesComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reutrack-v2';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoginPage = false;

  token!:any;

  constructor(private router: Router) {
    const rutasSinMenu = [
        '/login',
        '/reunion/asistencia/',
        '/acta_aceptacion/aprobacion/',
        '/agradecimiento'
    ];

    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        const urlActual = event.urlAfterRedirects;
        this.isLoginPage = rutasSinMenu.some(path => urlActual.startsWith(path));
        
        this.sidenav.close();
        this.token = localStorage.getItem('token');
    });
  }

}
