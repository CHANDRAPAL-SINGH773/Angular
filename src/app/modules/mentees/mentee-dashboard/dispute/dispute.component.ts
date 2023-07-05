import { Component, OnInit } from '@angular/core';

import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from "src/app/Shared/token";


@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss']
})
export class DisputeComponent extends AuthorizationToken implements OnInit {

  id: any;
  loginError: any;
  errortext: any;
  disputeList: any=[];
  pages: number=1;
  showImage: any = environment.urlBackend;
  disputeId: any;
  submitted:boolean=false;
  totaldocs: any = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,) { 
    super();
    this.id = this.getLocalStorageID();

    }

  ngOnInit(): void {
    let data={
        filter: "",
        userId: this.id,
        // mentorid: this.user_id,
        page: this.pages,
    }
   this.listofDisputes(data)
  }
  listofDisputes(data:any) {

    this.mentorservice.listofDisputes(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.disputeList = res.data.docs;
        console.log("🚀 ~ file: disputes.component.ts:41 ~ DisputesComponent ~ this.mentorservice.listofDisputes ~   this.disputeList:",   this.disputeList)
      
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
  getId(id:any){
this.disputeId=id
  }
  // reply(){
  //   this.submitted = true
  //   if (!this.replyForm.valid) {
  //     return
  //   }
  //   let body={
  //       id:this.disputeId,
  //       reply:this.replyForm.get("reply")?.value
  //   }
    
  //   this.mentorservice.replyonDispute(body).subscribe((res: any) => {
  //     if (res.status === "Success" && res.messageID === 200) {
  //       this.toastr.success(res.message, res.status);
  //       let data={
  //         filter: "",
  //         userId: this.id,
  //         // mentorid: this.user_id,
  //         page: this.pages,
  //     }
  //    this.listofDisputes(data)
  //     }
  //   }, (err: any) => {
  //     let res = err?.error;
  //     if (res?.status === "Failed" && res?.messageID === 409) {
  //       this.toastr.error(res?.message, res?.status);
  //     } else if (res?.status === "Failed" && res?.messageID === 400) {
  //       this.toastr.error(res?.message[0].msg, res?.status);
  //     }

  //     else if (res?.status === "Failed" && res?.messageID === 404) {
  //       this.toastr.error(res?.message, res?.status);

  //     } else {
  //       this.loginError = true;
  //       this.errortext = res?.message;
  //       this.toastr.error(res?.message, res?.status);
  //     }
  //   })
  // }
  onKeyUpEvent(event: any) {
    let data={
      filter: event.target.value,
      userId: this.id,
      // mentorid: this.user_id,
      page: this.pages,
  }
  this.listofDisputes(data)
  }
  pageChange(page: any) {

    let data = {
      filter: "",
      userId: this.id,
      page: this.pages,
    };
    this.pages = page;
    this.listofDisputes(data);
  }
}
