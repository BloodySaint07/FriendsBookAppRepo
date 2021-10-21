import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isUserLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthenticationService) {
    this.isAdmin = authService.isAdmin();
    this.isUserLoggedIn = authService.isUserLoggedIn();
  }

  onLogoutClick() {
    this.authService.logout();
  }
}
