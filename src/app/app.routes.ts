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
        path: 'reunion/:codigo',
        loadComponent: () => import('./views/reuniones-view/reuniones-view.component').then(m => m.ReunionesViewComponent),
        canActivate: [AuthGuard]
    }
];
