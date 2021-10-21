import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import * as _ from 'underscore';

import { BaseComponent } from '../base/base.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseComponent implements OnInit {
  displayedColumns = ['firstName', 'city', 'phone', 'email', 'profession', 'actions'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  isLoading: Boolean = true;
  noUsers: Boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private userService: UserService, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      users = _.filter(users, function (user) { return user.isAdmin !== true });
      this.isLoading = false;
      this.noUsers = users.length === 0 ? true : false;
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
      throw err;
    });
  }

  onDisableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onEnableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };
    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}
