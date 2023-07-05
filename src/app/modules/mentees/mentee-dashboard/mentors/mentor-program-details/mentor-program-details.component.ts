import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";
@Component({
  selector: "app-mentor-program-details",
  templateUrl: "./mentor-program-details.component.html",
  styleUrls: ["./mentor-program-details.component.scss"],
})
export class MentorProgramDetailsComponent
  extends AuthorizationToken
  implements OnInit
{
  ids: string = "list";
  loginError: any;
  errortext: any;
  session_page: any = 1;
  id: any;
  count: any;
  AllData: any;
  showImage: any = environment.urlBackend;
  deleteData: any;
  calendarId: any = "";
  oneSessionDetail: any;
  oneUserData: any;
  user_id: any;
  heading: any;
  totaldocs: any = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();

    this.route.queryParams.subscribe((val: any) => {
      this.id = val.id;
      this.user_id = val.user_id;
    });
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      category_id: this.id,
      mentorid: this.user_id,
      page: this.session_page,
    };
    this.getallDetails(data);
  }

  getallDetails(data: any) {
    this.mentorservice.getmentorshipDetailsByCategory(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.AllData = res.data.docs;
          this.AllData.map((t1: any) => {
            this.heading = t1.category_id[0].categoryName;
          });
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

  getAllDaywise(data: any) {
    this.mentorservice.getAllDaywise(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          // this.count = res.data;
          this.AllData = res.data.docs;

          this.totaldocs = res.data.totalDocs;
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
      page: this.session_page,
      mentorid: this.user_id,
      category_id: this.id,
    };
    this.getallDetails(data);
  }
  closemodal() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      // this.router.navigate(["/mentor/mentor-dashboard/session-management"]);
    });
  }
  goBack(): void {
    this.location.back();
  }
  pageChange(page: any) {
    page = this.session_page;
    let data = {
      filter: "",
      page: page,
      category_id: this.id,
      mentorid: this.user_id,
    };
    this.getallDetails(data);
  }
}
