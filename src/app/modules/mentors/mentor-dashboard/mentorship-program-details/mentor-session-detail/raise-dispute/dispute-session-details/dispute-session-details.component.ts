import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dispute-session-details',
  templateUrl: './dispute-session-details.component.html',
  styleUrls: ['./dispute-session-details.component.scss']
})
export class DisputeSessionDetailsComponent extends AuthorizationToken implements OnInit {
  id: any;
  showImage: any = environment.urlBackend;
  totaldocs: any = 0;
  loginError: any;
  errortext: any;
  sessionData: any={};
  programid: any;
  sessionId: any;
  usersPage: any = 1;
  userData: any=[];
  constructor( private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,
    private location: Location,) {
    super();
    this.id = this.getLocalStorageID();
    this.route.queryParams.subscribe((val: any) => {
      this.sessionId=val._id
      this.programid = val.program_id;

    });

  }


  ngOnInit(): void {
    this.getOneDaywise()
    let data = {
      filter: "",
      page: this.usersPage,
      program_id:this.programid
    };
    this.getAllresigsterMentees(data);
  }
  getOneDaywise() {
    this.mentorservice.getOneDaywise(this.sessionId).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.sessionData = res.data;

      }
    }, (err: any) => {
      let res = err?.error;
      if (res?.status === "Failed" && res?.messageID === 409) {
        this.toastr.error(res?.message, res?.status);
      } else if (res?.status === "Failed" && res?.messageID === 400) {
        this.toastr.error(res?.message[0].msg, res?.status);
      }

      else if (res?.status === "Failed" && res?.messageID === 404) {
        this.toastr.error(res?.message, res?.status);

      } else {
        this.loginError = true;
        this.errortext = res?.message;
        this.toastr.error(res?.message, res?.status);
      }
    })
  }
  getAllresigsterMentees(data: any) {
    this.mentorservice.getAllresigsterMentees(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.userData = res.data.docs;
        console.log("🚀 ~ file: dispute-session-details.component.ts:80 ~ DisputeSessionDetailsComponent ~ this.mentorservice.getAllresigsterMentees ~  this.userData:",  this.userData)
        this.totaldocs = res.data.totalDocs;
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

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.usersPage,
      program_id:this.programid
    };
    this.getAllresigsterMentees(data);
  }

  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
      program_id:this.programid
    };
    this.getAllresigsterMentees(data);
  }
  back(){
    this.location.back();
  }
}
