import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  isNewForm: Observable<boolean>;
  genders: String[] = ['Male', 'Female'];

  constructor(private userService: UserService, private formBuilder: FormBuilder, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      phone: [''],
      city: [''],
      state: [''],
      country: [''],
      pincode: [''],
      profession: ['Developer'],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      isActive: [true]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.userService.getUserByEmail(this.form.value.email).pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      if (users && users.length > 0) {
        this.toastService.openSnackBar('Email already exist!', '', 'error-snackbar');
        return;
      }

      this.userService.register(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.isNewForm = observableOf(false);
      });
    })
  }
}
