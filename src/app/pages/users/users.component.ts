import { Component } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: iUser[] = [];

  constructor(private usersSvc: UsersService) {}

  ngOnInit() {
    this.usersSvc.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
