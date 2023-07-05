import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenteesRoutingModule } from "./mentees-routing.module";
import { SharedModule } from "src/app/common/shared.module";
import { MenteeDashboardComponent } from "./mentee-dashboard/mentee-dashboard.component";
import { SessionManagementComponent } from './mentee-dashboard/session-management/session-management.component';
import { DashboardContentComponent } from './mentee-dashboard/dashboard-content/dashboard-content.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MentorsComponent } from './mentee-dashboard/mentors/mentors.component';
import { MentorDetailsComponent } from './mentee-dashboard/mentors/mentor-details/mentor-details.component';
import { NgxPaginationModule } from "ngx-pagination";
import { ProgramsComponent } from './mentee-dashboard/dashboard-content/programs/programs.component';
import { MenteeAddedSessionsComponent } from './mentee-dashboard/session-management/mentee-added-sessions/mentee-added-sessions.component';
import { RaiseDisputeComponent } from './mentee-dashboard/session-management/raise-dispute/raise-dispute.component';
import { MentorshipProgramComponent } from './mentee-dashboard/mentorship-program/mentorship-program.component';
import { MentorshipProgramDetailsComponent } from './mentee-dashboard/mentorship-program/mentorship-program-details/mentorship-program-details.component';
import { RatingsComponent } from './mentee-dashboard/session-management/ratings/ratings.component';
import { RequestNewProgramComponent } from './mentee-dashboard/mentorship-program/request-new-program/request-new-program.component';
import { MentorProgramDetailsComponent } from './mentee-dashboard/mentors/mentor-program-details/mentor-program-details.component';
import { MenteeProfileComponent } from './mentee-dashboard/mentee-profile/mentee-profile.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SafePipeModule } from 'safe-pipe'
import { NgxStarRatingModule } from 'ngx-star-rating';
import { PastSessionManagementComponent } from './mentee-dashboard/session-management/past-session-management/past-session-management.component';
import { DisputeComponent } from './mentee-dashboard/dispute/dispute.component';
// import { NgxStripeModule } from "ngx-stripe";
import { DatePipe } from '@angular/common';
 import { TimeFormatPipe } from '../../Shared/time-format.pipe';

@NgModule({
  declarations: [
  TimeFormatPipe,
    MenteeDashboardComponent,
    SessionManagementComponent,
    DashboardContentComponent,
    MentorsComponent,
    MentorDetailsComponent,
    ProgramsComponent,
    MenteeAddedSessionsComponent,
    RaiseDisputeComponent,
    MentorshipProgramComponent,
    MentorshipProgramDetailsComponent,
    RatingsComponent,
    RequestNewProgramComponent,
    MentorProgramDetailsComponent,
    MenteeProfileComponent,
    PastSessionManagementComponent,
    DisputeComponent],
  imports: [
    CommonModule,
    MenteesRoutingModule,
    SharedModule,
    FullCalendarModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SafePipeModule,
    NgxStarRatingModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAm-LurscF5upUllWpiWImD4stS4WrEFRE',
    //   libraries: ['places']
    // })
    // NgxStripeModule.forRoot(
    //   "pk_test_51MuWLEDVqL6IyTEptLVpC5s8EoTI7P9aDiH4F6DQZYAfb9d3f17TtdtE7k99SPaUzkn3Iv2x9tLuoVRtTWpgb7Wv00sQBLvWjq"
    // )
  ],
})
export class MenteesModule { }
