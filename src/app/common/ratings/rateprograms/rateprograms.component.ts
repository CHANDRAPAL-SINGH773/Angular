import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { Location, DecimalPipe } from "@angular/common";

@Component({
  selector: "app-rateprograms",
  templateUrl: "./rateprograms.component.html",
  styleUrls: ["./rateprograms.component.scss"],
})
export class RateprogramsComponent
  extends AuthorizationToken
  implements OnInit
{
  loginError: any;
  errortext: any;
  mentor_id: any;
  oneUserData: any = [];
  UserData:any = [];
  mentorship_page: any = 1;
  datas: any;
  ratingAverage: any;
  showImage: any = environment.urlBackend;
  rating:any = [];
  allDataInfo: any = [];
  today = new Date().toISOString().split("T")[0];
  averageRating: any = [];
  cancellationRating:any = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private mentorservice: MentorServiceService,
    private adminService: AdminService
  ) {
    super();
    this.mentor_id = this.getLocalStorageID();
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      mentor_id: this.mentor_id,
      page: this.mentorship_page,
    };
    this.getProgramsForRating(data);
    this.updateMentorRatingCount();
    this.cancellationShowMentor();
  }

  mentorAverage() {
    let myjson = {
      mentor_id: this.mentor_id,
      averageRating: this.averageRating,
    };
    this.mentorservice.mentorAverage(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        console.log(res.data, "data");
      }
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
      };
    });
  }

  getProgramsForRating(data: any) {
    this.mentorservice.getProgramsForRating(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneUserData = res.data.docs;
          console.log(this.oneUserData,"this.oneUserData");
          
          this.UserData = res.data.docs.filter((data: any) => data.averageRating !== 0);


          this.datas = this.oneUserData.filter(
            (el: any) => el.averageRating > 0
          );
          let totalRating = 0;
          for (let i = 0; i < this.datas.length; i++) {
            totalRating += this.datas[i].averageRating;
          }

          let count = this.datas.length;
          this.averageRating = count > 0 ? totalRating / count : 0;

          console.log(this.averageRating, "totalRating");
          
          if (this.averageRating < 0.5) {
            this.averageRating = 0;
          } else if (this.averageRating < 1.5) {
            this.averageRating = 1;
          } else if (this.averageRating < 2.5) {
            this.averageRating = 2;
          } else if (this.averageRating < 3.5) {
            this.averageRating = 3;
          } else if (this.averageRating < 4.5) {
            this.averageRating = 4;
          } else {
            this.averageRating = Math.floor(this.averageRating);
          }
          console.log(this.averageRating);
          this.mentorAverage();
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

  goBack(): void {
    this.location.back();
  }
  selectOption(event: any) {
    let data = {
      filter: "",
      page: this.mentorship_page,
    };
    this.getProgramsForRating(data);
  }
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
      mentor_id: this.mentor_id,
    };
    this.mentorservice.getProgramsForRating(data).subscribe((res: any) => {});
  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.mentorship_page,
      mentor_id: this.mentor_id,
    };
    this.getProgramsForRating(data);
  }

  updateMentorRatingCount(){
    let id = {
      user_id : this.mentor_id
    }
    this.mentorservice.updateMentorRatingCount(id).subscribe((res:any)=>{
      if (res.status === "Success" && res.messageID === 200) {
        this.rating = res.data.rating;
        console.log(this.rating,"this.rating")
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
    })
  }

  cancellationShowMentor(){
    this.mentorservice.cancellationShowMentor().subscribe((res:any)=>{
      if (res.status === "Success" && res.messageID === 200) {
        this.cancellationRating = res.data
        console.log(this.cancellationRating.rating,"this.cancellationRating")
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
    })
  }
}
