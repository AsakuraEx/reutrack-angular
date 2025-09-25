import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ActaAceptacionService } from '../services/acta-aceptacion.service';

export const actaActivaGuard: CanActivateFn = (route, state) => {
  
  const actaAceptacionService = inject(ActaAceptacionService);
  const router = inject(Router);

  // Usar route en lugar de routeActive para los parámetros
  const codigo = Number(route.paramMap.get('id_acta'));

  if (!codigo) {
    router.navigate(['/']);
    return false;
  }

  // Retornar el observable directamente
  return actaAceptacionService.obtenerActaPorId(codigo).pipe(
    map(response => {
      const actaActual = response;
      if (actaActual.estado.id === 6) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }),
    catchError(err => {
      console.error(err);
      router.navigate(['/']);
      return of(false);
    })
  );
};