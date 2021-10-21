import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private toastService: ToastService,
    private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email]
      ]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe(userFetched => {
      if (!userFetched || userFetched.length <= 0) {
        this.toastService.openSnackBar('Email does not exist!', '', 'error-snackbar');
        return;
      }

      let existingUser = userFetched[0];
      this.router.navigate(['reset-password'], { queryParams: { id: existingUser.id } });
    });
  }
}
