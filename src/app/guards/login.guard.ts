import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth-service.service";

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        
        const token = localStorage.getItem('token')
        if(!token){
            return true;
        }else{
            this.router.navigate(['/']);
            return false
        }
    }

}