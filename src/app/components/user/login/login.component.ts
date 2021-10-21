import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';

import { AuthenticationService } from '../../../services/authentication.service';
import { BaseComponent } from '../../base/base.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthenticationService, private toastService: ToastService,
    private router: Router, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]
      ],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.authService.login(this.form.value.email, this.form.value.password)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe(loginResponse => {
        if (loginResponse && loginResponse.message) {
          this.toastService.openSnackBar(loginResponse.message, '', 'error-snackbar');
          return;
        }
        this.router.navigate(['dashboard']);
      }, err => {
        this.toastService.openSnackBar('Invalid Credentials', '', 'error-snackbar');
      });
  }

  onForgotPassword() {
    this.router.navigate(['forgot-password']);
  }
}
