import { Router } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { iUser } from '../../interfaces/i-user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      name: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      age: this.fb.control(''),
    });
  }

  register() {
    if (!this.form.valid) {
      return;
    }
    const formValue: iUser = this.form.value as iUser;
    this.authSvc.register(formValue).subscribe();
    this.form.reset();
    alert('registrazione avvenuta con successo!');
    this.router.navigate(['/']);
    console.log(formValue);
    console.log(this.form.valid);
  }

  isValid(fieldName: string) {
    return this.form.get(fieldName)?.valid;
  }
  isTouched(fieldName: string) {
    return this.form.get(fieldName)?.touched;
  }

  isInValidTouched(fieldName: string) {
    return !this.isValid(fieldName) && this.isTouched(fieldName);
  }
}
