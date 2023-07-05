import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/Services/auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.component.html",
  styleUrls: ["./otp-verification.component.scss"],
})
export class OtpVerificationComponent implements OnInit {
  token: any;
  loginrole: any;
  // verificationForm: FormGroup;
  type: any;
  errortext: any;
  loginError: any;
  from: any;
  config: any = {};
  otp: any;
  myotp: any;
  mailID: any;
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.verificationForm = new FormGroup({
    //   otp: new FormControl(""),
    //   role: new FormControl(""),
    // });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.token = val.token;
      this.type = val.type;
      this.from = val.from;
      this.mailID = val.mail;
      console.log(this.mailID ,"<<<");
      
    });
  }
  ResendOTP() {
    this.authService.resendOTP(this.token).subscribe((res: any) => {
      if (res.status === "Success" && res.responseCode === 200) {
        this.toastr.success("OTP sent successfully", res.message, res.status,);
      } else {
        this.toastr.error(res.message, res.status);
      }
    });
  }
  onOtpChange(otp: any) {
    if (otp.length === 6) {
      this.otp = otp;

    }
  }
  optverified() {
    // this.submitted= true
    // if(this.loginForm.invalid){
    //    this.toastr.error('Invalid')
    //   return
    // }
    if (this.otp.length !== 6) {
      this.toastr.error('Enter 6 digit OTP')
      return
    }
    let myjson: any = {
      otp: this.otp
    }
    this.authService.verifyOTP(this.token, myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.responseCode === 200) {
          this.toastr.success(res.message, res.status);
          if (this.from) {
            if (this.type) {
              this.router.navigate(["/reset-password"], {
                queryParams: { type: this.type, token: res.data.token },
              });
            } else {
              this.router.navigate(["/reset-password"], {
                queryParams: { token: res.data.token },
              });
            }
          } else {
            this.router.navigate(["/login"], {
              queryParams: { type: this.type },
            });
          }
        }
        // else{
        //   this.toastr.error(res.msg,res.status);
        //   this.router.navigate(['/login'],{queryParams:{type:this.type}})
        // }
      },
      (err: any) => {
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
    );
  }

  gotoLogin() {
    this.router.navigate(["/login"], { queryParams: { type: this.type }, });
  }
}
