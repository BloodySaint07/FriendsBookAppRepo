import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'underscore';

import { PostService } from '../../../services/post.service';
import { FileUploadService } from '../../../services/fileupload.service';
import { FriendService } from '../../../services/friend.service';
import { ProfileHelperService } from '../../../utilities/profile-helper.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  activeUserObject: any;
  existingPhotoId: String;
  noOfPosts: Number = 0;
  noOfConnections: Number = 0;
  imageToShow: String | ArrayBuffer;
  isImageLoaded: Boolean = false;
  isImageAvailable: Boolean = false;

  constructor(private postService: PostService, private fileService: FileUploadService,
    private friendService: FriendService, private profileHelper: ProfileHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.loadActiveUserPhoto(this.existingPhotoId);
    this.loadActiveUserPostCounts(this.activeUserObject._id);
    this.loadActiveUserConnections(this.activeUserObject._id);
  }

  loadActiveUserPhoto(photoId: String) {
    this.fileService.getPhotoById(photoId).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      this.createImageFromBlob(result);
      this.isImageLoaded = true;
    }, err => {
      this.isImageLoaded = true;
      this.isImageAvailable = false;
    });
  }

  loadActiveUserPostCounts(userId: String) {
    this.postService.getPostByUserId(userId).pipe(takeUntil(this.unsubscribe)).subscribe(result => this.noOfPosts = result.length);
  }

  loadActiveUserConnections(userId: String) {
    this.friendService.getAllFriendRequests().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      let matchingElement = _.filter(result, function (item) {
        return (item.userId === userId || item.friendId === userId) && item.status === 'You are friend';
      });

      this.noOfConnections = matchingElement.length;
    });
  }

  onProfilePhotoUpload(event) {
    this.profileHelper.changeActiveUserProfilePhoto(this.activeUserObject._id, event)
      .pipe(takeUntil(this.unsubscribe)).subscribe(newPhotoId => {
        localStorage.setItem('currentUserPhotoId', newPhotoId);
        this.ngOnInit();
      });
  }

  
  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      this.isImageAvailable = true;
      reader.readAsDataURL(image);
    }
  }
}
