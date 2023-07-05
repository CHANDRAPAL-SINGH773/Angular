import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthorizationToken } from 'src/app/Shared/token';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { FormArray, FormBuilder,FormControl,FormGroup,Validators,FormsModule} from "@angular/forms";
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends AuthorizationToken implements OnInit {
  changePasswordForm:FormGroup;
  loginError: any;
  errortext: any;
  submitted:boolean=false;
  id: any;
  text: string = "text";
  password: string = "password";
  conf: string = "password";
  newPass:string="password"
  constructor( private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,) { 
      super();
      this.changePasswordForm = new FormGroup({
        oldPassword: new FormControl("", [Validators.required]),
        newPassword: new FormControl("", [Validators.required,Validators.minLength(6)]),
        confirmpassword:new FormControl("", [Validators.required])
      })
    }
    get f() { return this.changePasswordForm.controls; }
  ngOnInit(): void {
    this.id = this.getLocalStorageID();
  }
  resetPassword() {
    this.submitted = true
    if (!this.changePasswordForm.valid) {
      return
    }

    if ( this.changePasswordForm.get("newPassword")?.value != this.changePasswordForm.get("confirmpassword")?.value) {
      this.toastr.error("Password did not match!");
      return
    }

    if ( this.changePasswordForm.get("newPassword")?.value == this.changePasswordForm.get("oldPassword")?.value) {
      this.toastr.error("Your new password must be different from the previously used password");
      return
    }


    let myjson: any = {
      _id: this.id ,
      oldPassword: this.changePasswordForm.get("oldPassword")?.value,
      newPassword:this.changePasswordForm.get("newPassword")?.value,
    };
    this.mentorservice.changePassword(myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.submitted=false
           this.changePasswordForm.reset();
    // this.changePasswordForm.setErrors(null, { emitEvent: false });
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
  togglePassword() {
    if (this.password === "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }
  togglePassword1() {
    if (this.conf === "password") {
      this.conf = "text";
    } else {
      this.conf = "password";
    }
  }
  togglePassword2() {
    if (this.newPass === "password") {
      this.newPass = "text";
    } else {
      this.newPass = "password";
    }
  }
}
