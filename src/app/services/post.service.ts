import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/post.model';
import { HeaderService } from './header.service';
import { AppConfig } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient, private header: HeaderService) { }

    createPost(newPost: Post) {
        return this.http.post<Post>(this.apiBaseURL + 'posts/createpost', newPost, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    getAllPosts() {
        return this.http.get<Post[]>(this.apiBaseURL + 'posts/');
    }

    getPostById(postId: String): any {
        return this.http.get(this.apiBaseURL + 'posts/' + postId).pipe(res => {
            return res;
        });
    };

    getPostByUserId(userId: String): any {
        return this.http.post(this.apiBaseURL + 'posts/findpostbyuserid', { id: userId }, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    updateBulkPosts(updatePayload) {
        return this.http.post<Post>(this.apiBaseURL + 'posts/updatemanyposts', updatePayload).pipe(res => {
            return res;
        });
    }

    updatePost(updatedPost: Post) {
        return this.http.put<Post>(this.apiBaseURL + 'posts/' + updatedPost.id, updatedPost).pipe(res => {
            return res;
        });
    };
}
