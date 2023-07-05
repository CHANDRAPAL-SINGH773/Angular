import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from "ngx-ui-loader";
import { HttpClientModule } from "@angular/common/http";
import { NgHttpLoaderModule } from "ng-http-loader";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AdminDashboardComponent } from "./modules/admin/admin-dashboard/admin-dashboard.component";
import { UserManagementComponent } from "./modules/admin/user-management/user-management.component";
import { AdminSidebarComponent } from "./modules/admin/admin-sidebar/admin-sidebar.component";
import { UserProfileComponent } from "./modules/admin/user-management/user-profile/user-profile.component";
import { CategoryManagementComponent } from "./modules/admin/category-management/category-management.component";
import { MeetingCancelManagementComponent } from "./modules/admin/meeting-cancel-management/meeting-cancel-management.component";
import { SessionManagementComponent } from "./modules/admin/session-management/session-management.component";
import { LoginComponent } from "./Registration/login/login.component";
import { LandingPageComponent } from "./Registration/landing-page/landing-page.component";
import { MentorSignupComponent } from "./Registration/mentor-signup/mentor-signup.component";
import { MenteeSignupComponent } from "./Registration/mentee-signup/mentee-signup.component";
import { OtpVerificationComponent } from "./Registration/otp-verification/otp-verification.component";
import { PaymentManagementComponent } from "./modules/admin/payment-management/payment-management.component";
import { DisputeManagementComponent } from "./modules/admin/dispute-management/dispute-management.component";
import { CategoryPathComponent } from "./modules/admin/category-path/category-path.component";
import { AdminLoginComponent } from "./modules/admin/admin-login/admin-login.component";
import { AuthGuard } from "./Shared/auth-guard";
import { ForgotPasswordComponent } from "./Registration/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Registration/reset-password/reset-password.component";
import { NgxPaginationModule } from "ngx-pagination";
import { ErrorComponent } from "./error/error.component";
// import { InterceptorService } from './Services/interceptor/interceptor.service';
import { NgOtpInputModule } from "ng-otp-input";
import { AuthGuardLogin } from "./Shared/auth-gaurd-login";
import { SharedModule } from "./common/shared.module";
import { AdminHeaderComponent } from './modules/admin/admin-header/admin-header.component';
import { TimeagoModule } from 'ngx-timeago';
import { AdminProfileComponent } from './modules/admin/admin-profile/admin-profile.component';
import { SocialMediaPostComponent } from './modules/admin/social-media-post/social-media-post/social-media-post.component';
import { SafePipeModule } from 'safe-pipe';
import { AdminChatComponent } from './modules/admin/admin-chat/admin-chat.component'
import { ChatComponent } from "./common/chat/chat.component";
import { StaticPageTemplateComponent } from './modules/admin/static-page-template/static-page-template.component';
import { AdminRequestedProgramListComponent } from './modules/admin/admin-requested-program-list/admin-requested-program-list.component';
import { AdminMeetingCancelationComponent } from './modules/admin/admin-meeting-cancelation/admin-meeting-cancelation.component';
import { PaymentSettelmentComponent } from './modules/admin/payment-settelment/payment-settelment.component';
import { ReferalManagementComponent } from './modules/admin/referal-management/referal-management.component';
import { SessionDetailsComponent } from "./modules/admin/session-management/session-details/session-details.component";
import { TemplatesComponent } from './modules/admin/templates/templates.component';
// import { QuillModule } from "ngx-quill";
import { CKEditorModule } from 'ckeditor4-angular';
import { DatePipe } from '@angular/common';
import { AuthGuardMentee } from "./Shared/auth-guard-mentee";
import { AuthGuardAdmin } from "./Shared/auth-gaurd-admin";
//  import { TimeFormatPipe } from './Shared/time-format.pipe';
@NgModule({
  declarations: [
    //  TimeFormatPipe,
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    AdminDashboardComponent,
    UserManagementComponent,
    AdminSidebarComponent,
    UserProfileComponent,
    CategoryManagementComponent,
    MeetingCancelManagementComponent,
    SessionManagementComponent,
    LandingPageComponent,
    MentorSignupComponent,
    MenteeSignupComponent,
    OtpVerificationComponent,
    PaymentManagementComponent,
    DisputeManagementComponent,
    CategoryPathComponent,
    AdminLoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ErrorComponent,
    AdminHeaderComponent,
    AdminProfileComponent,
    SocialMediaPostComponent,
    AdminChatComponent,
    StaticPageTemplateComponent,
    AdminRequestedProgramListComponent,
    AdminMeetingCancelationComponent,
    PaymentSettelmentComponent,
    ReferalManagementComponent,
    SessionDetailsComponent,
    TemplatesComponent,
    // SidebarComponent,
    // MentorSidebarComponent,
    // ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    SharedModule,
    ReactiveFormsModule,
    TimeagoModule.forRoot(),
    ToastrModule.forRoot({}),
    NgxUiLoaderModule.forRoot({
      bgsColor: "red",
      bgsOpacity: 0.5,
      bgsPosition: "bottom-right",
      bgsSize: 60,
      bgsType: "ball-spin-clockwise",
      blur: 5,
      delay: 0,
      fastFadeOut: true,
      fgsColor: "#ffffff",
      fgsPosition: "center-center",
      fgsSize: 60,
      fgsType: "three-strings",
      gap: 24,
      logoPosition: "center-center",
      logoSize: 120,
      logoUrl: "",
      masterLoaderId: "master",
      overlayBorderRadius: "0",
      overlayColor: "rgba(40, 40, 40, 0.8)",
      pbColor: "red",
      pbDirection: "ltr",
      pbThickness: 3,
      hasProgressBar: false,
      text: "Loading...",
      textColor: "#FFFFFF",
      textPosition: "center-center",
      maxTime: -1,
      minTime: 300,
    }),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
    NgHttpLoaderModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgOtpInputModule,
    SafePipeModule,
    CKEditorModule

  ],
  providers: [AuthGuard, AuthGuardLogin,AuthGuardMentee,AuthGuardAdmin ,CookieService,DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
