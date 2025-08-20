import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/inicio-view/inicio-view.component').then(m => m.InicioViewComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./views/login-view/login-view.component').then(m => m.LoginViewComponent),
    },
    {
        path: 'about',
        loadComponent: () => import('./views/acerca-de/acerca-de.component').then(m => m.AcercaDeComponent),
    }
];
