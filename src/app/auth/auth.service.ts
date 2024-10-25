import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { iResponseData } from '../interfaces/i-response-data';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { iUser } from '../interfaces/i-user';
import { iLoginData } from '../interfaces/i-login-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  jwtHelper: JwtHelperService = new JwtHelperService();

  authSubject$ = new BehaviorSubject<iResponseData | null>(null);
  isLoggedIn$ = this.authSubject$.asObservable().pipe(map((data) => !!data));
  user$ = this.authSubject$
    .asObservable()
    .pipe(map((data) => (data ? data.user : null)));

  constructor(private http: HttpClient, private router: Router) {
    this.getSavedUser();
  }

  register(newUser: Partial<iUser>) {
    return this.http.post<iResponseData>(this.registerUrl, newUser);
  }

  login(dataLogin: iLoginData) {
    return this.http.post<iResponseData>(this.loginUrl, dataLogin).pipe(
      tap((authData) => {
        console.log(authData);

        this.authSubject$.next(authData);

        localStorage.setItem('loginData', JSON.stringify(authData));

        const expData = this.jwtHelper.getTokenExpirationDate(
          authData.accessToken
        );

        if (expData) {
          this.autoLogout(expData);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('loginData');
    this.authSubject$.next(null);
    this.router.navigate(['/login']);
  }

  autoLogout(expData: Date) {
    const expTime = expData.getTime() - new Date().getTime();

    setTimeout(() => {
      this.logout();
    }, expTime);
  }

  getSavedUser() {
    const savedUser = localStorage.getItem('loginData');

    if (!savedUser) return;
    const loginResponse: iResponseData = JSON.parse(savedUser);

    if (this.jwtHelper.isTokenExpired(loginResponse.accessToken)) {
      localStorage.removeItem('loginData');
      return;
    }
    this.authSubject$.next(loginResponse);
  }
}
