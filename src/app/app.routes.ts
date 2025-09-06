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
    },
    {
        path: 'historial',
        loadComponent: () => import('./views/historial-view/historial-view.component').then(m => m.HistorialViewComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'reunion/detalle/:id',
        loadComponent: () => import('./views/detalle-view/detalle-view.component').then(m => m.DetalleViewComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'proyectos',
        loadComponent: () => import('./views/gestion-proyectos/proyectos-view/proyectos-view.component').then(m => m.ProyectosViewComponent),
        canActivate: [AuthGuard]
    },
        {
        path: 'versiones',
        loadComponent: () => import('./views/gestion-proyectos/versiones-view/versiones-view.component').then(m => m.VersionesViewComponent),
        canActivate: [AuthGuard]
    },
];
