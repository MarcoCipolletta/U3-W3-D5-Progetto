import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iUser } from '../interfaces/i-user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  usersUrl = environment.usersUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<iUser[]>(this.usersUrl);
  }
}
