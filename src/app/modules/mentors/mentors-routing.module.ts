import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChatDetailsComponent } from "src/app/common/chat/chat-details/chat-details.component";
import { ChatComponent } from "src/app/common/chat/chat.component";
import { HelpAndSupportComponent } from "src/app/common/help-and-support/help-and-support.component";
import { PaymentComponent } from "src/app/common/payment/payment.component";
import { PostOnSocialMediaComponent } from "src/app/common/post-on-social-media/post-on-social-media.component";
import { RatingsComponent } from "src/app/common/ratings/ratings.component";
import { ReferAndEarnComponent } from "src/app/common/refer-and-earn/refer-and-earn.component";
import { SettingsComponent } from "src/app/common/settings/settings.component";
 import { AuthGuard } from "src/app/Shared/auth-guard";
import { AuthGuardLogin } from "src/app/Shared/auth-gaurd-login";
// import { AddBankAccountComponent } from "./mentor-dashboard/add-bank-account/add-bank-account.component";
import { BankDetailsComponent } from "./mentor-dashboard/bank-details/bank-details.component";
import { DashboardContentComponent } from "./mentor-dashboard/dashboard-content/dashboard-content.component";
import { MentorDashboardComponent } from "./mentor-dashboard/mentor-dashboard.component";
import { MentorProfileComponent } from "./mentor-dashboard/mentor-profile/mentor-profile.component";
import { MentorAddNewSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-add-new-session/mentor-add-new-session.component";
import { MentorAddedSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-added-session/mentor-added-session.component";
import { MentorEditNewSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-edit-new-session/mentor-edit-new-session.component";
import { MentorSessionManagementComponent } from "./mentor-dashboard/mentor-session-management/mentor-session-management.component";
import { CompletedSessionsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/completed-sessions/completed-sessions.component";
import { MentorSessionDetailComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/mentor-session-detail.component";
import { DisputeCommentComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/dispute-comment/dispute-comment.component";
import { DisputeSessionDetailsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/dispute-session-details/dispute-session-details.component";
import { RaiseDisputeComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/raise-dispute.component";
import { RegisteredMenteesComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/registered-mentees/registered-mentees.component";
import { ViewRatingsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/view-ratings/view-ratings.component";
import { AddProgramComponent } from "./mentor-dashboard/mentorship-program-management/add-program/add-program.component";
import { EditProgramComponent } from "./mentor-dashboard/mentorship-program-management/edit-program/edit-program.component";
import { MentorshipProgramDetailsComponent } from "./mentor-dashboard/mentorship-program-management/mentorship-program-details/mentorship-program-details.component";
import { MentorshipProgramComponent } from "./mentor-dashboard/mentorship-program-management/mentorship-program/mentorship-program.component";
import { CardDetailsComponent } from "./mentor-dashboard/card-details/card-details.component";
import { InformationDetailsComponent } from "./mentor-dashboard/information-details/information-details.component";
import { RateprogramsComponent } from "src/app/common/ratings/rateprograms/rateprograms.component";
import { RatesessionsComponent } from "src/app/common/ratings/ratesessions/ratesessions.component";
import { DisputesComponent } from "./mentor-dashboard/disputes/disputes.component";
import { RequestedProgramComponent } from "./mentor-dashboard/requested-program/requested-program.component";
const routes: Routes = [
  {
    path: "mentor-dashboard",
    component: MentorDashboardComponent,
      // canActivate:[AuthGuardLogin],

    children: [
      {
        path: "",
        component: DashboardContentComponent,
        //canActivate:[AuthGuardLogin],
      },
      {
        path: "mentorship",
        component: MentorshipProgramComponent,
        //canActivate:[AuthGuardLogin],
      },
      {
        path: "profile",
        component: MentorProfileComponent,
      },
      {
        path: "mentorshipDetails",
        component: MentorshipProgramDetailsComponent,
      },
      {
        path: "session-management",
        component: MentorSessionManagementComponent,
      },
      {
        path: "add-session",
        component: MentorAddNewSessionComponent,
      },
      {
        path: "edit-session",
        component: MentorEditNewSessionComponent,
      },
      {
        path: "session",
        component: MentorAddedSessionComponent,
      },

      {
        path: "bank-details",
        component: BankDetailsComponent,
      },
      {
        path: "card-details",
        component: CardDetailsComponent,
      },

      {
        path: "information-details",
        component: InformationDetailsComponent,
      },
      {
        path: "session-detail",
        component: MentorSessionDetailComponent,
      },
      {
        path: "registered-mentees",
        component: RegisteredMenteesComponent,
      },
      {
        path: "completed-sessions",
        component: CompletedSessionsComponent,
      },
      {
        path: "raise-dispute",
        component: RaiseDisputeComponent,
      },
      {
        path: "dispute-session",
        component: DisputeSessionDetailsComponent,
      },
      {
        path: "dispute-comment",
        component: DisputeCommentComponent,
      },
      {
        path: "add-newprogram",
        component: AddProgramComponent,
      },
      {
        path: "edit-program",
        component: EditProgramComponent,
      },
      {
        path: "view-ratings",
        component: ViewRatingsComponent,
      },
      {
        path: "chat",
        component: ChatComponent,
        children: [
          { path: ':chatId', component: ChatDetailsComponent }
        ]
      },
      {
        path: "help&support",
        component: HelpAndSupportComponent,
      },
      {
        path: "requested-program",
        component: RequestedProgramComponent,
      },
      {
        path: "post",
        component: PostOnSocialMediaComponent,
      },
      {
        path: "ratings",
        component: RatingsComponent,
      },
      {
        path: "ratedprograms",
        component: RateprogramsComponent,
      },
      {
        path: "ratedsessions",
        component: RatesessionsComponent,
      },
      {
        path: "refer&earn",
        component: ReferAndEarnComponent,
      },
      {
        path: "payment",
        component: PaymentComponent,
      },
      {
        path: "settings",
        component: SettingsComponent,
      },
      {
        path: "alldiputes",
        component: DisputesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentorsRoutingModule { }
