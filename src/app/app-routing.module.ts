import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminDashboardComponent } from "./modules/admin/admin-dashboard/admin-dashboard.component";
import { CategoryManagementComponent } from "./modules/admin/category-management/category-management.component";
import { MeetingCancelManagementComponent } from "./modules/admin/meeting-cancel-management/meeting-cancel-management.component";
import { SessionManagementComponent } from "./modules/admin/session-management/session-management.component";
import { UserManagementComponent } from "./modules/admin/user-management/user-management.component";
import { UserProfileComponent } from "./modules/admin/user-management/user-profile/user-profile.component";
import { LandingPageComponent } from "./Registration/landing-page/landing-page.component";
import { LoginComponent } from "./Registration/login/login.component";
import { MenteeSignupComponent } from "./Registration/mentee-signup/mentee-signup.component";
import { MentorSignupComponent } from "./Registration/mentor-signup/mentor-signup.component";
import { OtpVerificationComponent } from "./Registration/otp-verification/otp-verification.component";
import { PaymentManagementComponent } from "./modules/admin/payment-management/payment-management.component";
import { DisputeManagementComponent } from "./modules/admin/dispute-management/dispute-management.component";
import { CategoryPathComponent } from "./modules/admin/category-path/category-path.component";
import { MentorDashboardComponent } from "./modules/mentors/mentor-dashboard/mentor-dashboard.component";
import { AdminLoginComponent } from "./modules/admin/admin-login/admin-login.component";

import { ForgotPasswordComponent } from "./Registration/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./Registration/reset-password/reset-password.component";
import { ErrorComponent } from "./error/error.component";
import { AuthGuardLogin } from "./Shared/auth-gaurd-login";
import { DashboardComponent } from "./dashboard/dashboard/dashboard.component";
import { MenteeDashboardComponent } from "./modules/mentees/mentee-dashboard/mentee-dashboard.component";
import { ChatComponent } from "./common/chat/chat.component";
import { AdminProfileComponent } from "./modules/admin/admin-profile/admin-profile.component";
import { SocialMediaPostComponent } from "./modules/admin/social-media-post/social-media-post/social-media-post.component";
import { ChatDetailsComponent } from "./common/chat/chat-details/chat-details.component";
import { AdminChatComponent } from "./modules/admin/admin-chat/admin-chat.component";
import { StaticPageTemplateComponent } from "./modules/admin/static-page-template/static-page-template.component";
import { MapComponent } from "./modules/mentees/mentee-dashboard/map/map.component";
import { AdminRequestedProgramListComponent } from "./modules/admin/admin-requested-program-list/admin-requested-program-list.component";
import { AdminMeetingCancelationComponent } from "./modules/admin/admin-meeting-cancelation/admin-meeting-cancelation.component";
import { PaymentSettelmentComponent } from "./modules/admin/payment-settelment/payment-settelment.component";
import { ReferalManagementComponent } from "./modules/admin/referal-management/referal-management.component";
import { SessionDetailsComponent } from "./modules/admin/session-management/session-details/session-details.component";
import { TemplatesComponent } from "./modules/admin/templates/templates.component";
import { AuthGuard } from "./Shared/auth-guard";
import { AuthGuardMentee } from "./Shared/auth-guard-mentee";
import { AuthGuardAdmin } from "./Shared/auth-gaurd-admin";

// import { MapComponent } from "./common/map/map.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    //canActivate:[AuthGuardLogin],
  },
  {
    path: "mentee",
    loadChildren: () =>
      import("./modules/mentees/mentees.module").then((m) => m.MenteesModule),
    canActivate: [AuthGuardMentee],
  },
  {
    path: "mentor",
    loadChildren: () =>
      import("./modules/mentors/mentors.module").then((m) => m.MentorsModule),
    canActivate: [AuthGuardLogin],
  },
  // {
  //   path: 'common',
  //   loadChildren: () => import("./common/common.module").then(m => m.CommonModule)
  // },
  {
    path: "admin-login",
    component: AdminLoginComponent,
    //  canActivate:[AuthGuardLogin],
  },
  {
    path: "admin-profile",
    component: AdminProfileComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "",
    component: LandingPageComponent,
    // canActivate:[AuthGuardLogin],
  },
  {
    path: "admin-dashboard",
    component: AdminDashboardComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-user-management",
    component: UserManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-user-profile",
    component: UserProfileComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-category-management",
    component: CategoryManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-session-management",
    component: SessionManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "session-details",
    component: SessionDetailsComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-meeting-cancel-management",
    component: MeetingCancelManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-payment-management",
    component: PaymentManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-dispute-management",
    component: DisputeManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-category-path",
    component: CategoryPathComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-social-media",
    component: SocialMediaPostComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-requested-program",
    component: AdminRequestedProgramListComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-meetingCancelation",
    component: AdminMeetingCancelationComponent,
    canActivate: [AuthGuardAdmin],
  },

  {
    path: "admin-paymentSettelment",
    component: PaymentSettelmentComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "admin-referal-management",
    component: ReferalManagementComponent,
    canActivate: [AuthGuardAdmin],
  },
  {
    path: "mentor-signup",
    component: MentorSignupComponent,
    // canActivate: [AuthGuardAdmin],
  },
  {
    path: "mentee-signup",
    component: MenteeSignupComponent,
  },
  {
    path: "verifyOTP",
    component: OtpVerificationComponent,
  },

  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: LandingPageComponent,
  },
  // {
  //   path: "mentor-dashboard",
  //   component: MentorDashboardComponent,
  // },
  // {
  //   path: "mentee-dashboard",
  //   component: MenteeDashboardComponent,
  // },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
  },
  {
    path: "main-dashboard",
    component: DashboardComponent,
  },
  {
    path: "templates",
    component: TemplatesComponent,
  },
  // {
  //   path: "chat",
  //   component: ChatComponent,
  //   children: [
  //     { path: ':chatId', component: ChatDetailsComponent }
  //   ]
  // },
  {
    path: "showmap",
    component: MapComponent,
  },
  {
    path: "adminChat",
    component: AdminChatComponent,
    children: [
      { path: ':chatId', component: ChatDetailsComponent }
    ]
  },

  {
    path: "staticPages",
    component: StaticPageTemplateComponent,
  },

  {
    path: "**",
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
