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
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, MatToolbarModule, RouterLink, MatButtonModule, MatIconModule, MenuOpcionesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reutrack-v2';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoginPage = false;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.urlAfterRedirects === '/login' || event.urlAfterRedirects.startsWith('/login');
      if(this.isLoginPage){
        this.sidenav.close();
      }
    });
  }

}
