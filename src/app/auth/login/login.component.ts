import { Component } from '@angular/core';
import { iLoginData } from '../../interfaces/i-login-data';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  datiLogin: iLoginData = {
    email: '',
    password: '',
  };
  errorMessage: string = '';

  constructor(private authSvc: AuthService, private router: Router) {}

  login() {
    this.authSvc.login(this.datiLogin).subscribe({
      next: (res) => {
        alert('login effettuato con successo');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error;
      },
    });
  }
}
