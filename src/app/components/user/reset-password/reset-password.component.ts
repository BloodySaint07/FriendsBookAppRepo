import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  existinUser: Params;
  isNewForm: Observable<Boolean>;

  constructor(private userService: UserService, private router: Router, private formBuilder: FormBuilder,
    private toastService: ToastService) {
    super();
    this.existinUser = this.router.getCurrentNavigation().extras.queryParams;
  }

  ngOnInit() {
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      id: [this.existinUser.id],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toastService.openSnackBar("Password entered do not match!", '', 'error-snackbar');
      return;
    }

    this.userService.updateUser(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe();
    this.isNewForm = observableOf(false);
  }
}
