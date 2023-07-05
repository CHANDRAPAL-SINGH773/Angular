import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import {FormBuilder,FormControl,FormGroup,Validators} from "@angular/forms"
@Component({
  selector: 'app-dispute-comment',
  templateUrl: './dispute-comment.component.html',
  styleUrls: ['./dispute-comment.component.scss']
})
export class DisputeCommentComponent extends AuthorizationToken implements OnInit {
  sessionId: any;
  programid: any;
  loginError: any;
  errortext: any;
  sessionData: any={};
  showImage: any = environment.urlBackend;
  userId: any;
  userdetail:any={}
  imgsrc: any;
  imagefiles: any;
  submitDisputeForm:FormGroup;
  submitted: boolean=false;
  logedinId: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,
    private location: Location,) {  
      super()
      this.logedinId= this.getLocalStorageID();
      this.route.queryParams.subscribe((val: any) => {   
    this.sessionId=val._id
    this.programid = val.program_id;
    this.userId=val.userId

  });
  this.submitDisputeForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
    image: new FormControl(''),
  })
}

  ngOnInit(): void {
    this.getOneDaywise()
    this.getUser()
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

  getUser() {
    this.adminService.getUser(this.userId).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.userdetail = res.data;
       

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
 
  handleimage(event: any, type: any) {
    console.log(event,"<<>>>>",type);
    
    if (event.target.files && event.target.files[0]) {
      if (type === 'image') {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imgsrc = event.target.result;

        }
        this.imagefiles = event.target.files[0];
      }
     
    }
  }
  raiseDisput(){
    this.submitted = true
    if (!this.submitDisputeForm.valid) {
      return
    }
    
    var formData: any = new FormData();
    formData.append("comment", this.submitDisputeForm.get('comment')?.value);
    formData.append("image", this.imagefiles);
    formData.append("userId", this.userId);
    formData.append("session_id", this.sessionId);
    formData.append("raisedById", this.logedinId);
    
    this.mentorservice.raiseDispute(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.submitted=false;
        this.submitDisputeForm.reset();
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
}
