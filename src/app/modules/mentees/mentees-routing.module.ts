import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MenteeDashboardComponent } from "./mentee-dashboard/mentee-dashboard.component";
import { AuthGuard } from "../../Shared/auth-guard";
import { SessionManagementComponent } from "./mentee-dashboard/session-management/session-management.component";
import { DashboardContentComponent } from "./mentee-dashboard/dashboard-content/dashboard-content.component";
import { MentorsComponent } from "./mentee-dashboard/mentors/mentors.component";
import { MentorDetailsComponent } from "./mentee-dashboard/mentors/mentor-details/mentor-details.component";
import { ProgramsComponent } from "./mentee-dashboard/dashboard-content/programs/programs.component";
import { MenteeAddedSessionsComponent } from "./mentee-dashboard/session-management/mentee-added-sessions/mentee-added-sessions.component";
import { RaiseDisputeComponent } from "./mentee-dashboard/session-management/raise-dispute/raise-dispute.component";
import { MentorshipProgramComponent } from "./mentee-dashboard/mentorship-program/mentorship-program.component";
import { MentorshipProgramDetailsComponent } from "./mentee-dashboard/mentorship-program/mentorship-program-details/mentorship-program-details.component";
import { RatingsComponent } from "./mentee-dashboard/session-management/ratings/ratings.component";
import { RequestNewProgramComponent } from "./mentee-dashboard/mentorship-program/request-new-program/request-new-program.component";
import { MentorProgramDetailsComponent } from "./mentee-dashboard/mentors/mentor-program-details/mentor-program-details.component";
import { MenteeProfileComponent } from "./mentee-dashboard/mentee-profile/mentee-profile.component";
import { AddBankAccountComponent } from "./mentee-dashboard/add-bank-account/add-bank-account.component";
import { PastSessionManagementComponent } from "./mentee-dashboard/session-management/past-session-management/past-session-management.component";
import { DisputeComponent } from "./mentee-dashboard/dispute/dispute.component";
import { AuthGuardLogin } from "src/app/Shared/auth-gaurd-login";
import { ChatComponent } from "src/app/common/chat/chat.component";
import { ChatDetailsComponent } from "src/app/common/chat/chat-details/chat-details.component";
import { ReferAndEarnComponent } from "src/app/common/refer-and-earn/refer-and-earn.component";
import { PostOnSocialMediaComponent } from "src/app/common/post-on-social-media/post-on-social-media.component";
import { SettingsComponent } from "src/app/common/settings/settings.component";
import { HelpAndSupportComponent } from "src/app/common/help-and-support/help-and-support.component";

const routes: Routes = [
  {
    path: "mentee-dashboard",
    component: MenteeDashboardComponent,
    // canActivate:[AuthGuardLogin],
    children: [
      {
        path: "",
        component: DashboardContentComponent,
        // canActivate:[AuthGuardLogin],
      },
      {
        path: "session",
        component: SessionManagementComponent,
      },
      {
        path: "mentors",
        component: MentorsComponent,
      },
      {
        path: "mentors-details",
        component: MentorDetailsComponent,
      },
      {
        path: "programs",
        component: ProgramsComponent,
      },
      {
        path: "added-sessions",
        component: MenteeAddedSessionsComponent,
      },
      {
        path: "raise-dispute",
        component: RaiseDisputeComponent,
      },
      {
        path: "mentorship-programs",
        component: MentorshipProgramComponent,
      },
      {
        path: "program-details",
        component: MentorshipProgramDetailsComponent,
      },
      {
        path: "refer&earn",
        component: ReferAndEarnComponent,
      },
      {
        path: "view-ratings",
        component: RatingsComponent,
      },
      {
        path: "chat",
        component: ChatComponent,
        children: [
          { path: ':chatId', component: ChatDetailsComponent }
        ]
      },
      {
        path: "add-new-program",
        component: RequestNewProgramComponent,
      },
      {
        path: "mentor-programs-details",
        component: MentorProgramDetailsComponent,
      },
      {
        path: "mentee-profile",
        component: MenteeProfileComponent,
      },
      {
        path: "add-account",
        component: AddBankAccountComponent,
      },
      {
        path: "past-session",
        component: PastSessionManagementComponent
      },
      {
        path:"dispute",
        component: DisputeComponent
      },
      {
        path: "post",
        component: PostOnSocialMediaComponent,
      },
      {
        path: "settings",
        component: SettingsComponent,
      },
      {
        path: "help&support",
        component: HelpAndSupportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenteesRoutingModule { }
