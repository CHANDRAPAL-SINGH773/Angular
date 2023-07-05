import { Component, OnInit } from "@angular/core";
import { AuthorizationToken } from "src/app/Shared/token";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from "src/environments/environment";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent
  extends AuthorizationToken
  implements OnInit {
  clicked: boolean = true;
  name: any;
  usersPage: any = 1;
  loginError: any;
  errortext: any;
  UserData: any = [];
  totalmentormentees: any;
  showImage: any = environment.urlBackend;
  totaldocs: any;
  dashboardDetails: any


  constructor(
    private toastr: ToastrService,
    private adminService: AdminService
  ) {
    super();
    this.name = this.getLocalStorageByName()
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.usersPage,
      roles: ""
    };
    this.allMentorMenteeList();
    this.adminDashboardStatsdetails();
  }
  mentorData: any[] = [];
  menteeList: any[] = []
  allMentorMenteeList() {
    this.adminService.allMentorMenteeList().subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.UserData = res.data;
        // console.log(this.UserData, "this.UserData")
        this.mentorData = this.UserData.filter((ele: any) => {
          return ele.role === 1
        })
        console.log(" this.mentorData", this.mentorData)
        this.menteeList = this.UserData.filter((ele: any) => {
          return ele.role === 2
        })
        // console.log("data1",this.mentorData)

        this.totalmentormentees = this.mentorData.length + this.menteeList.length
      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
      } else if (res.status === "Failed" && res.messageID === 400) {
        this.toastr.error(res.message[0].msg, res.status);
      }

      else if (res.status === "Failed" && res.messageID === 404) {
        this.toastr.error(res.message, res.status);

      } else {
        this.loginError = true;
        this.errortext = res.message;
        this.toastr.error(res.message, res.status);
      }
    })

  }


  adminDashboardStatsdetails() {
    this.adminService.adminDashboardStatsdetails().subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.dashboardDetails = res.data;
          console.log(this.dashboardDetails, " this.UdashboardDetailsserData");
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          this.toastr.error(res.message, res.status);
        } else if (res.status === "Failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else if (res.status === "Failed" && res.messageID === 404) {
          this.toastr.error(res.message, res.status);
        } else {
          this.loginError = true;
          this.errortext = res.message;
          this.toastr.error(res.message, res.status);
        }
      }
    );
  }

}
