import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { BaseComponent } from '../../base/base.component';
import { PostService } from '../../../services/post.service';
import { PostHelperService } from '../../../utilities/post-helper.service';
import { Post } from '../../../models/post.model';
import { ProfileHelperService } from '../../../utilities/profile-helper.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent extends BaseComponent implements OnInit {
  posts: Post[] = [];
  activeUserObject: any;
  existingPhotoId: String;
  form: FormGroup;
  isLoading: Boolean = true;
  noPosts: Boolean;

  constructor(private formBuilder: FormBuilder, private postService: PostService,
    private toastService: ToastService, private postHelper: PostHelperService,
    private profileHelper: ProfileHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
    this.profileHelper.currentMessage.subscribe(isReloadPage => {
      if (isReloadPage) {
        this.ngOnInit()
      }
    });
  }

  ngOnInit() {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.createPostForm();
    this.loadPosts();
  }

  private createPostForm() {
    this.form = this.formBuilder.group({
      post: ['', Validators.required],
      userId: [this.activeUserObject._id],
      userPhotoId: [this.existingPhotoId],
      userName: [this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName],
      isAdmin: [this.activeUserObject.isAdmin],
      profession: [this.activeUserObject.profession]
    });
  }

  private loadPosts() {
    this.postHelper.loadPosts(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalPosts => {
      this.noPosts = finalPosts.length <= 0 ? true : false;
      this.isLoading = false;
      this.posts = finalPosts;
    });
  }

  onSubmit() {
    this.postService.createPost(this.form.value).subscribe(() => {
      this.createPostForm();
      this.loadPosts();
    }, err => {
      this.toastService.openSnackBar('Invalid Post', '', 'error-snackbar');
      throw err;
    });
  }

  onHidePostClick(postToHide: Post) {
    postToHide.isActive = false;
    this.postService.updatePost(postToHide).subscribe(() => {
      this.loadPosts();
    });
  }

  onPostImageUpload(event) {
    let formObject = {
      id: '',
      userId: this.activeUserObject._id,
      userPhotoId: this.existingPhotoId,
      userName: this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName,
      isAdmin: this.activeUserObject.isAdmin,
      profession: this.activeUserObject.profession
    };

    this.postHelper.uploadPostImage(formObject, event).subscribe(() => {
      this.ngOnInit();
    })
  }
}
