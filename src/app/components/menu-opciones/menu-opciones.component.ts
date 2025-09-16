import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu-opciones',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './menu-opciones.component.html',
  styleUrl: './menu-opciones.component.css'
})
export class MenuOpcionesComponent {

  darkMode: boolean = false;

  mostrarMenu = false;
  usuario!: any;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.mostrarMenu = false;
    });
  }

  toggleMenu(): void {
    this.mostrarMenu = !this.mostrarMenu
  }

  @HostListener('document:click', ['$event'])
  clicAfuera(event: Event): void {
    if(!this.elementRef.nativeElement.contains(event.target)) {
      this.mostrarMenu = false;
    }
  }

  cerrarSesion(): void {
    const token = localStorage.getItem('token')
    if(token){
      const decoded = jwtDecode(token)
      this.usuario = decoded
    }
    
   this.authService.cerrarSesion(this.usuario.id).subscribe({
    next: () => {
      localStorage.clear();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.log(err)
    }
   })
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('dark-mode');
    this.darkMode = !this.darkMode;
  }

}
