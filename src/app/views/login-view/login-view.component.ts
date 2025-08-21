import { Component } from '@angular/core';
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { AuthFormComponent } from './components/auth-form/auth-form.component';


@Component({
  selector: 'app-login-view',
  imports: [LoginFormComponent, AuthFormComponent],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {
  
  autenticacionExitosa = false;

  validarCredenciales(esValido: boolean){
    this.autenticacionExitosa = esValido;
  }

}
