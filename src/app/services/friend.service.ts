import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

import { HeaderService } from './header.service';
import { AppConfig } from '../config/app.config';
import { Friend } from '../models/friend.model';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class FriendService {

    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastService) { }

    createRequest(newRequest: Friend) {
        return this.http.post<Friend>(this.apiBaseURL + 'friends/createrequest', newRequest, this.header.requestHeaders())
            .pipe(map(res => {
                this.toastService.openSnackBar('Friend request sent Successfully', '', 'success-snackbar');
                return res;
            }));
    }

    getAllFriendRequests() {
        return this.http.get<any[]>(this.apiBaseURL + 'friends/');
    }

    getFriendById(id: String) {
        return this.http.get<Friend>(this.apiBaseURL + 'friends/' + id).pipe(map(res => {
            return res;
        }));
    };

    updateFriendRequest(updatedRequest) {
        return this.http.put(this.apiBaseURL + 'friends/' + updatedRequest.id, updatedRequest).pipe(res => {
            return res;
        });
    };
}
