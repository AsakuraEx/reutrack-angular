import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { ReunionService } from '../services/reunion.service';
import { catchError, map, of } from 'rxjs';

export const reunionActivaGuard: CanActivateFn = (route, state) => {
  
  const reunionService = inject(ReunionService);
  const router = inject(Router);

  // Usar route en lugar de routeActive para los parámetros
  const codigo = route.paramMap.get('codigo_reunion');

  if (!codigo) {
    router.navigate(['/']);
    return false;
  }

  // Retornar el observable directamente
  return reunionService.obtenerReunionPorCodigo(codigo).pipe(
    map(response => {
      console.log('estado: ' + response.id_estado)
      const reunionActual = response;
      if (reunionActual.id_estado === 1) {
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
