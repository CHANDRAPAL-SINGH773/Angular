import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { Location } from '@angular/common';
@Component({
  selector: 'app-ratesessions',
  templateUrl: './ratesessions.component.html',
  styleUrls: ['./ratesessions.component.scss']
})
export class RatesessionsComponent extends AuthorizationToken implements OnInit {
  loginError: any;
  errortext: any;
  mentor_id: any;
  oneUserData: any=[];
  rateSessionPage: any = 1;

  showImage: any = environment.urlBackend;
  allData: any=[];
  programId: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,) {
      super();
      this.mentor_id = this.getLocalStorageID();
     }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.programId = val._id;
    });

    let data={
      filter:'',
      page:this.rateSessionPage,
      mentorid:this.mentor_id,
      program_id:this.programId
    }
    this.getallDetails(data)
  }

  getallDetails(data: any) {
    this.mentorservice.getallprogramDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.allData = res.data.docs;
        console.log("🚀 ~ file: ratesessions.component.ts:53 ~ RatesessionsComponent ~ this.mentorservice.getallprogramDetails ~ this.allData:", this.allData)
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

  onKeyUpEvent(event:any){
    let data={
      filter:event.target.value,
      page:this.rateSessionPage,
      mentorid:this.mentor_id,
      program_id:this.programId
    }
    this.getallDetails(data)
  }
  goBack(): void {
    this.location.back();
  }
}
