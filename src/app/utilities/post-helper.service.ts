import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'underscore';

import { UtilityService } from '../services/utility.service';
import { PostService } from '../services/post.service';
import { FileUploadService } from '../services/fileupload.service';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostHelperService {

  constructor(private utility: UtilityService,
    private postService: PostService,
    private fileService: FileUploadService) { }

  calculatePostTimers(filteredPosts: any): Post[] {
    filteredPosts.forEach(element => {
      element.postTimer = this.utility.dateDifference(element.createdDate);
    });

    return filteredPosts.reverse();
  }

  private createImageFromBlob(image: Blob): Observable<any> {
    return new Observable(observer => {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        let imageToShow = reader.result;
        observer.next(imageToShow);
      }, false);

      if (image) {
        reader.readAsDataURL(image);
      }
    })
  }

  private loadUserIconForPosts(filteredPosts: any, userId: String): Observable<any> {
    return new Observable(observer => {
      filteredPosts.forEach(postElement => {
        postElement.isMyPost = postElement.userId === userId ? true : false;
        this.fileService.getPhotoById(postElement.userPhotoId).subscribe(res => {
          this.createImageFromBlob(res).subscribe(response => {
            postElement.userIcon = response;
            observer.next(filteredPosts);
          })
        }, err => {
          throw err;
        });
      });
    });
  }

  private loadPostImages(mappedPosts: any): Observable<any> {
    return new Observable(observer => {
      mappedPosts.forEach(postElement => {
        if (postElement.postImageId) {
          postElement.isPostImage = true;
          this.fileService.getPhotoById(postElement.postImageId).subscribe(res => {
            this.createImageFromBlob(res).subscribe(response => {
              postElement.postImage = response;
              observer.next(mappedPosts);
            });
          });
        } else {
          postElement.isPostImage = false;
          observer.next(mappedPosts);
        }
      });
    });
  }

  loadPosts(userId): Observable<any> {
    return new Observable(observer => {
      this.postService.getAllPosts().subscribe(posts => {
        if (posts.length === 0) {
          observer.next(posts);
        }

        let activePosts = _.filter(posts, function (post) { return post.isActive === true; });
        let aggregatePosts = this.calculatePostTimers(activePosts);

        this.loadUserIconForPosts(aggregatePosts, userId).subscribe(mappedPosts => {
          this.loadPostImages(mappedPosts).subscribe(finalPosts => {
            observer.next(finalPosts);
          });
        });
      });
    });
  }

  createNewPost(formObject: Post, uploadId: string): Observable<any> {
    return new Observable(observer => {
      const postObject = {
        id: formObject.id,
        post: '',
        userId: formObject.userId,
        userName: formObject.userName,
        userPhotoId: formObject.userPhotoId,
        postImageId: uploadId,
        isActive: true,
        isAdmin: formObject.isAdmin,
        profession: formObject.profession
      };

      this.postService.createPost(postObject).subscribe(() => {
        observer.next();
      });
    });
  }

  performPictureUploading(imageEvent): Observable<any> {
    return new Observable(observer => {
      if (imageEvent.target.files.length > 0) {
        const file = imageEvent.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        this.fileService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }

  uploadPostImage(formObject, imageEvent): Observable<any> {
    return new Observable(observer => {
      this.performPictureUploading(imageEvent).subscribe(uploadResult => {
        this.createNewPost(formObject, uploadResult.uploadId).subscribe(() => {
          observer.next(uploadResult);
        });
      });
    });
  }
}
