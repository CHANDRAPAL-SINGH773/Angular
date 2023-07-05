import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { MentorsRoutingModule } from "./mentors-routing.module";
import { AppModule } from "src/app/app.module";
import { SharedModule } from "src/app/common/shared.module";
import { MentorDashboardComponent } from "./mentor-dashboard/mentor-dashboard.component";
import { DashboardContentComponent } from "./mentor-dashboard/dashboard-content/dashboard-content.component";
import { MentorshipProgramComponent } from "./mentor-dashboard/mentorship-program-management/mentorship-program/mentorship-program.component";
import { MentorProfileComponent } from "./mentor-dashboard/mentor-profile/mentor-profile.component";
import { MentorshipProgramDetailsComponent } from "./mentor-dashboard/mentorship-program-management/mentorship-program-details/mentorship-program-details.component";
import { MentorSessionManagementComponent } from "./mentor-dashboard/mentor-session-management/mentor-session-management.component";
import { MentorAddNewSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-add-new-session/mentor-add-new-session.component";
import { MentorEditNewSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-edit-new-session/mentor-edit-new-session.component";
import { MentorAddedSessionComponent } from "./mentor-dashboard/mentor-session-management/mentor-added-session/mentor-added-session.component";
import { AddBankAccountComponent } from "../mentees/mentee-dashboard/add-bank-account/add-bank-account.component";
import { MentorSessionDetailComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/mentor-session-detail.component";
import { RegisteredMenteesComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/registered-mentees/registered-mentees.component";
import { CompletedSessionsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/completed-sessions/completed-sessions.component";
import { RaiseDisputeComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/raise-dispute.component";
import { DisputeSessionDetailsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/dispute-session-details/dispute-session-details.component";
import { DisputeCommentComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/raise-dispute/dispute-comment/dispute-comment.component";
import { AddProgramComponent } from "./mentor-dashboard/mentorship-program-management/add-program/add-program.component";
import { EditProgramComponent } from "./mentor-dashboard/mentorship-program-management/edit-program/edit-program.component";
import { ViewRatingsComponent } from "./mentor-dashboard/mentorship-program-details/mentor-session-detail/view-ratings/view-ratings.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import { ClipboardModule } from 'ngx-clipboard';
import { SafePipeModule } from 'safe-pipe'
import { NgxPaginationModule } from "ngx-pagination";
import { DatePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { NgChartsModule } from 'ng2-charts';
import { BankDetailsComponent } from './mentor-dashboard/bank-details/bank-details.component';
import { CardDetailsComponent } from './mentor-dashboard/card-details/card-details.component';
import { InformationDetailsComponent } from './mentor-dashboard/information-details/information-details.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { DisputesComponent } from './mentor-dashboard/disputes/disputes.component';
import { RequestedProgramComponent } from './mentor-dashboard/requested-program/requested-program.component';
// import { BankDetailsComponent } from './mentor-dashboard/bank-details/bank-details.component';
  //import { TimeFormatPipe } from 'src/app/Shared/time-format.pipe';
  // console.log(TimeFormatPipe,"TimeFormatPipe");
  
@NgModule({
  declarations: [
    MentorDashboardComponent,
    DashboardContentComponent,
    MentorshipProgramComponent,
    MentorProfileComponent,
    MentorshipProgramDetailsComponent,
    MentorSessionManagementComponent,
    MentorAddNewSessionComponent,
    MentorEditNewSessionComponent,
    MentorAddedSessionComponent,
    AddBankAccountComponent,
    MentorSessionDetailComponent,
    RegisteredMenteesComponent,
    CompletedSessionsComponent,
    RaiseDisputeComponent,
    DisputeSessionDetailsComponent,
    DisputeCommentComponent,
    AddProgramComponent,
    EditProgramComponent,
    ViewRatingsComponent,
    BankDetailsComponent,
    CardDetailsComponent,
    InformationDetailsComponent,
    DisputesComponent,
    RequestedProgramComponent,
   //  TimeFormatPipe
    
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    MentorsRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
    SafePipeModule,
    NgxPaginationModule,
    TimeagoModule.forRoot(),
    NgxStarRatingModule,
    NgChartsModule
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAm-LurscF5upUllWpiWImD4stS4WrEFRE',
    //   libraries: ['places']
    // })
  ],
  providers: [DatePipe],
})
export class MentorsModule { }
