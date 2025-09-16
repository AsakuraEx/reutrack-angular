import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { primerInicioGuard } from './guards/primer-inicio.guard';
import { reunionActivaGuard } from './guards/reunion-activa.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./views/inicio-view/inicio-view.component').then(m => m.InicioViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./views/login-view/login-view.component').then(m => m.LoginViewComponent),
        canActivate: [LoginGuard]
    },
    {
        path: 'reunion/:codigo',
        loadComponent: () => import('./views/reuniones-view/reuniones-view.component').then(m => m.ReunionesViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'historial',
        loadComponent: () => import('./views/historial-view/historial-view.component').then(m => m.HistorialViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'reunion/detalle/:id',
        loadComponent: () => import('./views/detalle-view/detalle-view.component').then(m => m.DetalleViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'proyectos',
        loadComponent: () => import('./views/gestion-proyectos/proyectos-view/proyectos-view.component').then(m => m.ProyectosViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'versiones/:id_proyecto',
        loadComponent: () => import('./views/gestion-proyectos/versiones-view/versiones-view.component').then(m => m.VersionesViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'usuarios',
        loadComponent: () => import('./views/usuario-view/usuario-view.component').then(m => m.UsuarioViewComponent),
        canActivate: [AuthGuard, primerInicioGuard]
    },
    {
        path: 'cambiar-contrasena',
        loadComponent: () => import('./views/cambiar-contrasena-view/cambiar-contrasena-view.component').then(m => m.CambiarContrasenaViewComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'reportes/reuniones-reactivadas',
        loadComponent: () => import('./views/reportes-view/reuniones-reactivadas/reuniones-reactivadas.component').then(m => m.ReunionesReactivadasComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'reportes/proyectos-eliminados',
        loadComponent: () => import('./views/reportes-view/proyectos-eliminados/proyectos-eliminados.component').then(m => m.ProyectosEliminadosComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'reunion/asistencia/:codigo_reunion',
        loadComponent: () => import('./views/asistencia-view/asistencia-view.component').then(m => m.AsistenciaViewComponent),
        canActivate: [reunionActivaGuard]
    },
];
