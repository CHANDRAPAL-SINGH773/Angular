import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from "src/app/Shared/token";
import { Location } from '@angular/common';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { environment } from "src/environments/environment";
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-raise-dispute',
  templateUrl: './raise-dispute.component.html',
  styleUrls: ['./raise-dispute.component.scss']
})
export class RaiseDisputeComponent extends AuthorizationToken implements OnInit {
  logedinId: any;
  isloading: boolean = false;
  allData: any={};
  loginError: any;
  errortext: any;
  sessionId: any;
  showImage: any = environment.urlBackend;
  addDispute:FormGroup;
  submitted:boolean=false;
  imgsrc: any;
  imagefiles: any;
  mentorId: any;
  constructor(
    private mentorservice: MentorServiceService,
    private menteeService:MenteeService,
    private router: Router,
    private route:ActivatedRoute,
    private toastr: ToastrService,
    private location: Location
  ) {
    super();
    this.logedinId = this.getLocalStorageID();
    this.addDispute = new FormGroup({
      comment: new FormControl('', [Validators.required]),
    image: new FormControl(''),
    })
  }
 

  goBack(): void {
    this.location.back();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.sessionId = val.session_id; 
      this.getuserAndSession();
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
          this.isloading=true
        }
        this.imagefiles = event.target.files[0];
      }
     
    }
  }
  getuserAndSession(){
    this.menteeService.getuserAndSession(this.sessionId).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.allData = res.data;
          this.mentorId=this.allData.user_id
					this.isloading=true
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
  )}

  raiseDisput(){
    this.submitted = true
    if (!this.addDispute.valid) {
      return
    }
    
    var formData: any = new FormData();
    formData.append("comment", this.addDispute.get('comment')?.value);
    formData.append("image", this.imagefiles);
    formData.append("userId", this.mentorId);
    formData.append("session_id", this.sessionId);
    formData.append("raisedById", this.logedinId);
    
    this.mentorservice.raiseDispute(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.submitted=false;
        this.addDispute.reset();
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
