import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/inicio-view/inicio-view.component').then(m => m.InicioViewComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./views/login-view/login-view.component').then(m => m.LoginViewComponent),
        canActivate: [LoginGuard]
    },
    {
        path: 'about',
        loadComponent: () => import('./views/acerca-de/acerca-de.component').then(m => m.AcercaDeComponent),
        canActivate: [AuthGuard]
    }
];
