import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import { AppConfig } from './config/app.config';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './core-services/auth.guard';
import { BaseComponent } from './components/base/base.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { JwtInterceptor } from './core-services/jwt.interceptor';
import { LoginComponent } from './components/user/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NetworkComponent } from './components/network/network.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { PostsComponent } from './components/home/posts/posts.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersComponent } from './components/users/users.component';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    NavbarComponent,
    FriendsComponent,
    NetworkComponent,
    SettingsComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UsersComponent,
    DashboardComponent,
    ProfileComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    GlobalErrorHandlerService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
