import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthorizationToken } from "../../Shared/token";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { FormControl, FormGroup, Validators, FormBuilder,} from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-help-and-support',
  templateUrl: './help-and-support.component.html',
  styleUrls: ['./help-and-support.component.scss']
})
export class HelpAndSupportComponent extends AuthorizationToken implements OnInit {
  helpForm:FormGroup;
  id: any;
  submitted:boolean=false;
  loginError: any;
  errortext: any;
  logedinEmail:any;
  content!:string;
  name: any;
  adminData: any={};
  email:any;
  constructor( 
    private router: Router,
    private toastr: ToastrService,
    private menteeService: MenteeService,) { 

      super();
      this.id = this.getLocalStorageID();
      this.logedinEmail=this.getLocalStorageEmail()
      this.name=this.getLocalStorageByName()
      this.helpForm = new FormGroup({
        // email: new FormControl(''),
        // subject: new FormControl(''),
        body: new FormControl('', Validators.required),
      })
    }

  ngOnInit(): void {
  this.getAdmin()
  }


  helpSupport(){
    this.submitted = true
    if (!this.helpForm.valid) {
      return
    }
    
  let emailFields={
  email:this.email,
  // email:this.helpForm.get('emailto')?.value,
  description:`This mail has got from ${this.name} with mail ID ${this.logedinEmail}.  ${this.helpForm.get('body')?.value}`,
  userId:this.id 

}

console.log(emailFields,"emailFields");

    this.menteeService.helpSupport(emailFields).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
      
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
  
  
  getAdmin(){
  this.menteeService.getAdmin().subscribe((res: any) => {
    if (res.status === "Success" && res.messageID === 200) {
      this.adminData=res.data;
      this.email=this.adminData.helpSupportEmail;
    
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
