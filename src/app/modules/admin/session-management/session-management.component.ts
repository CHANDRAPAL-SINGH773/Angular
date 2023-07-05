import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/Services/admin/admin.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-session-management",
  templateUrl: "./session-management.component.html",
  styleUrls: ["./session-management.component.css"],
})
export class SessionManagementComponent implements OnInit {
  sessionPage: any = 1;
  sessionData: any = [];
  loginError: any;
  errortext: any;
  mentorship_mode: any;
  selectedValue: any;
  totaldocs: any;
  programid: any;
  id: any;
  pid: any;
  sid: any;
  selectedOption: string = "";
  currentSessions: any[] = [];
  upcomingSessions: any[] = [];
  pastSessions: any[] = [];
  filteredSessions: any[] = [];
  startDate: any;
  current_date: any;
  endDate: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminservice: AdminService
  ) { }

  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.sessionPage,
      mentorship_mode: "",
    };
    this.allSessionList(data);
  }

  /**
  Fetches the list of sessions based on the provided data.
  */

  allSessionList(data: any) {
    this.adminservice.sessionList(data).subscribe(
      (res: any) => {
        console.log(res, "res");
        if (res.status === "Success" && res.messageID === 200) {
          this.sessionData = res.data;
          this.programid = this.sessionData.map((session: any) => {
            return {
              program_id: session.program_id,
              _id: session._id,
            };
          });
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

  /**
  Updates the session status based on the provided event and sessioin ID.
  */
  changesessionStatus(event: any, catID: any) {
    let status = event.target.checked;
    if (status == true) {
      console.log(status);
      status = 1;
    } else {
      status = 2;
    }
    let data = {
      id: catID,
      status: status,
    };
    console.log(data, "data");

    this.adminservice.updateSessionStatus(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
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

  /**
  Handles the key up event and triggers the session list update based on the entered filter value.
  */
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      mentorship_mode: this.mentorship_mode,
      page: this.sessionPage,
      orderBy: [],
    };
    this.allSessionList(data);
  }

  /**
  Handles the page change event and triggers the session list update based on the new page.
  */
  pageChange(page: any) {
    let data = {
      filter: "",
      mentorship_mode: this.mentorship_mode,
      page: this.sessionPage,
    };
    this.allSessionList(data);
  }

  /**
Sorts the session list by mentorship mode based on the selected value from the dropdown.
*/
  sortByMode(event: any) {
    this.mentorship_mode = event.target.value;
    console.log(this.mentorship_mode);
    let data = {
      filter: "",
      mentorship_mode: this.mentorship_mode,
      page: this.sessionPage,
    };
    this.allSessionList(data);
  }

  /**
Sorts the session list by date based on the selected value from the dropdown.
*/
  sortByDate(event: any) {

    let data = {
      filter: event.target.value,
      page: this.sessionPage,
    };
    console.log(data, "data check sort by");

    this.allSessionList(data);
    // let date = event.target.value;
    // console.log(date,"daaa")
    // let data = {};
    // if (date === "current") {
    //   console.log("current kkkk")
    //   data = {
    //     filter: "",
    //     mentorship_mode: this.mentorship_mode,
    //     page: this.sessionPage,
    //     startDate: new Date().toISOString(),
    //     endDate: new Date().toISOString()
    //   };
    // } else if (date === "past") {
    //    data = {
    //     filter: "",
    //     mentorship_mode: this.mentorship_mode,
    //     page: this.sessionPage,
    //     endDate: new Date().toISOString()
    //   };
    // } else if (date === "upcoming") {
    //   data = {
    //     filter: "",
    //     mentorship_mode: this.mentorship_mode,
    //     page: this.sessionPage,
    //     startDate: new Date().toISOString()
    //   };
    // } else {
    //    data = {
    //     filter: "",
    //     mentorship_mode: this.mentorship_mode,
    //     page: this.sessionPage
    //   };
    // }
    // this.allSessionList(data);
  }

  /**
Navigates to the map page and passes the program ID and session ID as query parameters.
*/
  goTomap(sid:any,pid:any) {
    // let pid = pid ;
    // let sid = sid;
    this.router.navigate(["/showmap"], {
      queryParams: { pid: pid, sid: sid },
    });
  }
}
