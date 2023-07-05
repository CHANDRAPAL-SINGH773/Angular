import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { HelpAndSupportComponent } from './help-and-support/help-and-support.component';
import { PostOnSocialMediaComponent } from './post-on-social-media/post-on-social-media.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import { PaymentComponent } from './payment/payment.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangeBankDetailsComponent } from './settings/change-bank-details/change-bank-details.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { NotificationSettingsComponent } from './settings/notification-settings/notification-settings.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { ChatDetailsComponent } from './chat/chat-details/chat-details.component';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxStripeModule } from "ngx-stripe";
import { NgxPaginationModule } from 'ngx-pagination';
import { RateprogramsComponent } from './ratings/rateprograms/rateprograms.component';
import { RatesessionsComponent } from './ratings/ratesessions/ratesessions.component';
import { AgmCoreModule } from "@agm/core";
import { MapComponent } from '../modules/mentees/mentee-dashboard/map/map.component';
import { SiteMapComponent } from './settings/site-map/site-map.component';
import { BlogPageComponent } from './settings/blog-page/blog-page.component';
import { AboutUsComponent } from './settings/about-us/about-us.component';
import { ContactUsComponent } from './settings/contact-us/contact-us.component';
// import { MapComponent } from './map/map.component';
@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ChatComponent,
    HelpAndSupportComponent,
    PostOnSocialMediaComponent,
    RatingsComponent,
    ReferAndEarnComponent,
    PaymentComponent,
    SettingsComponent,
    ChangeBankDetailsComponent,
    ChangePasswordComponent,
    NotificationSettingsComponent,
    TermsConditionsComponent,
    ChatDetailsComponent,
    RateprogramsComponent,
    RatesessionsComponent,
    MapComponent,
    SiteMapComponent,
    BlogPageComponent,
    AboutUsComponent,
    ContactUsComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TimeagoModule.forRoot(),
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxStripeModule.forRoot(
      "pk_test_51MuWLEDVqL6IyTEptLVpC5s8EoTI7P9aDiH4F6DQZYAfb9d3f17TtdtE7k99SPaUzkn3Iv2x9tLuoVRtTWpgb7Wv00sQBLvWjq"
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAm-LurscF5upUllWpiWImD4stS4WrEFRE',
      libraries: ['places']
    })
  ],
  providers: [DatePipe],
  exports: [
    HeaderComponent,
    SidebarComponent,
    TimeagoModule,
    ChatComponent,
    DatePipe,
    NgxStripeModule,
    MapComponent
  ]
})
export class SharedModule { }
