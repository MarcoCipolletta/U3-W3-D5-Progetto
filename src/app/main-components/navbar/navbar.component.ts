import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  constructor(private authSvc: AuthService) {}
  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe((value) => {
      this.isLoggedIn = value;
    });
  }
  logout() {
    this.authSvc.logout();
  }
}
