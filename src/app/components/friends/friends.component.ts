import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../models/user.model';
import { UserHelperService } from '../../utilities/user-helper.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent extends BaseComponent implements OnInit {
  friends: User[] = [];
  activeUserObject: any;
  noFriends: Boolean;
  isLoading: Boolean = true;

  constructor(private userHelper: UserHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.userHelper.loadRequestingFriends(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalRequesters => {
      this.isLoading = false;
      this.noFriends = finalRequesters.length === 0 ? true : false;
      this.friends = finalRequesters;
    });
  }

  onAcceptButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'You are friend'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onRejectButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'Request Rejected'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }
}
