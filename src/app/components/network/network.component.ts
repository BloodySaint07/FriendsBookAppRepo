import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { UserHelperService } from '../../utilities/user-helper.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent extends BaseComponent implements OnInit {
  networkUsers: User[] = [];
  activeUserObject: any;
  noUsers: Boolean = false;
  isLoading: Boolean = true;

  constructor(private userService: UserService, private userHelper: UserHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(allUsers => {
      if (allUsers.length <= 1) {
        this.isLoading = false;
        this.noUsers = true;
        return;
      }

      this.userHelper.createNetworkUserList(this.activeUserObject._id, allUsers).pipe(takeUntil(this.unsubscribe)).subscribe(networkUsers => {
        this.isLoading = false;
        this.noUsers = networkUsers.length === 0 ? true : false;
        this.networkUsers = networkUsers;
      });
    });
  }

  onRequestButtonClick(userClicked) {
    let friendRequestObject = {
      id: '',
      userId: this.activeUserObject._id,
      friendId: userClicked.id,
      status: 'Request Pending'
    }

    this.userHelper.createNewFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}
