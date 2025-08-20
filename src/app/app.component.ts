import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, MatToolbarModule, RouterLink, MatButtonModule],
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
