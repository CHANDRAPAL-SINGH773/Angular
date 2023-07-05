import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';

@Component({
  selector: 'app-post-on-social-media',
  templateUrl: './post-on-social-media.component.html',
  styleUrls: ['./post-on-social-media.component.scss']
})
export class PostOnSocialMediaComponent extends AuthorizationToken implements OnInit {
  socialMediaForm: FormGroup;
  submitted: boolean = false;
  myjson = {};
  loginError: any;
  errortext: any;
  userId:any;
  content: any={};

  constructor(private toastr: ToastrService, private mentorservice: MentorServiceService, private router: Router,
    private route: ActivatedRoute) {
      super();
      this.userId=this.getLocalStorageID()
    this.socialMediaForm = new FormGroup({
      media_post: new FormControl('', [Validators.required]),

    });
  }

  ngOnInit(): void {
   
  }


  submit() {
    this.submitted = true
    if (!this.socialMediaForm.valid) {
      return
    }

    let myjson: any = {
      media_post: this.socialMediaForm.get("media_post")?.value,
      userId:this.userId
    }
    console.log(myjson,"myjson");
    
    this.mentorservice.postOnsocialMedia(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.submitted=false
        this.socialMediaForm.reset();
      }
      else if (res.status === "failed" && res.messageID === 400) {
        this.toastr.error(res.message[0].msg, res.status);
      }
      else {
        this.toastr.error(res.message, res.status);
      }
    }, (err: any) => {
      let res = err.error;
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
        // this.authService.verifyOTP(res.token).subscribe((res1:any) => { });
        // this.router.navigate(["/"]);
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
    )
  }

  getStaticPages(){
  let body = {
      type : "TnC for Social Sharing"

  }
  this.mentorservice.getStaticPages(body).subscribe((res: any) => {
    if (res.status === "Success" && res.messageID === 200) {
      this.content = res.data;
      console.log(this.content,"content")
     


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

 stripTags(html:any) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText;
}

}