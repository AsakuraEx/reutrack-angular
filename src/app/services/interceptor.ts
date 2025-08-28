import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const Interceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('token');
    const router = inject(Router)

    if(token){
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        return next(authReq).pipe(
            catchError((error) => {
                if(error.status === 401){
                    localStorage.removeItem("token");
                    router.navigate(['/login'])
                }
                return throwError(()=>error);
            })

        )
    }

    return next(req)

}