import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-dashboard-content",
  templateUrl: "./dashboard-content.component.html",
  styleUrls: ["./dashboard-content.component.scss"],
})
export class DashboardContentComponent
  extends AuthorizationToken
  implements OnInit {
  loginError: any;
  errortext: any;
  oneUserData: any;
  showHeading: any;
  catId: any;
  mentorship_page: any = 1;
  showImage: any = environment.urlBackend;
  mode: any;
  AllData: any=[];
  allDataInfo: any;
  today = new Date().toISOString().split("T")[0];
  loadData: boolean = false;
  session_page: any = 1;
  id: any;
  role: any;
  rating: any;
  totaldocs: any = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private menteeService: MenteeService,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private datePipe: DatePipe
  ) {
    super();
    this.id = this.getLocalStorageID();
    this.role = this.getLocalStorageRole();
  }
  
  ngOnInit(): void {
    let data = {
      filter: "",
      // category_id: this.catId,
      page: this.mentorship_page,
    };
    this.menteeTrendingProgram(data);
    let getData = {
      filter: "",
      user_id: this.id,
      page: this.session_page,
    };
    this.getAllDaywiseForMentee(getData);
  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      // user_id: this.id,
      page: this.mentorship_page,
    };
    this.menteeTrendingProgram(data);
  }
  getAllDaywiseForMentee(data: any) {

    this.menteeService.getAllDaywiseForMentee(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.AllData = res.data.docs;
          this.loadData = true;
          // this.AllData.filter((el: any) => {
          //   this.mode = el.mentorship_mode;
          //   console.log(this.mode, "mode");

          //   if (el.start_date > this.today) {
          //     this.allDataInfo.push(el);
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

  menteeTrendingProgram(data: any) {
    this.menteeService.menteeTrendingProgram(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          // this.count = res.data;
          this.oneUserData = res.data.docs;
          // console.log(this.oneUserData,"this.oneUserData")
          this.totaldocs = res.data.totalDocs;

          this.oneUserData.map((t1: any) => {
            this.showHeading = t1.category_id[0].categoryName;
            this.catId = t1.category_id[0]._id;
          });

           this.oneUserData[0].sessionData.forEach((session:any) => {
            // console.log(session.averageRating);
            this.rating = session.averageRating
          // console.log(this.rating)
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


  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
    };
    this.mentorship_page = page;
    this.menteeTrendingProgram(data);

  }
  // selectOption(event: any) {
  //   let data = {
  //     filter: "",
  //     page: page,
  //   };
  //   this.menteeTrendingProgram(data);

  // }

}
