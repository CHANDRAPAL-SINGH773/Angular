import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { EventInput } from "@fullcalendar/core";
import { createEventId } from "src/app/Shared/event-utils";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";

@Component({
  selector: "app-past-session-management",
  templateUrl: "./past-session-management.component.html",
  styleUrls: ["./past-session-management.component.scss"],
})
export class PastSessionManagementComponent
  extends AuthorizationToken
  implements OnInit
{
  allDataInfo: any = [];
  pastData: any;
  AllData: any=[];
  loadData: any;
  loginError: any;
  errortext: any;
  id: any;
  session_page: any = 1;
  INITIAL_EVENTS: EventInput[] = [];
  mode: any;
  type :any;
  today: Date = new Date();
  start_date: any;
  showImage: any = environment.urlBackend;
  totaldocs:any
  constructor(
    private location: Location,
    private router: Router,
    private toastr: ToastrService,
    private menteeservice: MenteeService
  ) {
    super();
    this.id = this.getLocalStorageID();
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      user_id: this.id,
      page: this.session_page,
    };
    this.pastgetAllDaywiseForMentee(data);
  }

  pastgetAllDaywiseForMentee(data: any) {
    this.menteeservice.pastgetAllDaywiseForMentee(data).subscribe(
      (res: any) => {
        // this.allDataInfo = [];
        // this.pastData = [];
        if (res.status === "Success" && res.messageID === 200) {
          this.AllData = res.data.docs;
          this.loadData = true;
          this.totaldocs = res.data.totalDocs;

          // this.AllData.filter((el: any) => {
          //   this.mode = el.mentorship_mode;
          //   this.start_date = moment(el.start_date);

          //   if (this.mode === 0) {
          //     this.pastData.push(el);
          //   }

          //   if (this.mode === 1) {
          //     this.pastData.push(el);
          //     console.log(
          //       "🚀 ~ file: past-session-management.component.ts:74 ~ this.AllData.filter ~     this.pastData:",
          //       this.pastData
          //     );
          //   }
          // });
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      user_id: this.id,
      page: this.session_page,
    };
    this.pastgetAllDaywiseForMentee(data);
  }

  pageChange(page: any) {
    let data = {
      filter: "",
      user_id: this.id,
      page: page,
    };
    this.session_page = page;
    this.pastgetAllDaywiseForMentee(data);
  }

  goBack() {
    this.location.back();
  }
}
