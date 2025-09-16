import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const primerInicioGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const token = localStorage.getItem('token');

  if(token) {
    const decoded:any = jwtDecode(token);
    console.log(decoded)

    if(decoded.first_session === 1){
      router.navigate(['/cambiar-contrasena'])
      return false
    }
    return true
  }
  return true;
};
