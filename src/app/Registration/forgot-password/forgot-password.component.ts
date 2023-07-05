import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/Services/auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  emailverificationForm: FormGroup;
  type: any;
  loginError: any;
  errortext: any;
  token: any;
  submitted!: boolean
  mail: any;
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.emailverificationForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
    });
  }
  get f() { return this.emailverificationForm.controls; }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.type = val.type;
    });
  }

  sendEmail() {
    this.submitted = true
    if (!this.emailverificationForm.valid) {
      return
    }
    let myjson = this.emailverificationForm.get("email")?.value;

    this.authService.forgotPassword(myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.responseCode === 200) {
          this.toastr.success(
            res.message,
            "OTP sent to your email address.",
            res.status
          );
          this.token = res.data.token;
          this.mail = res.mail;
          if (this.type) {
            this.router.navigate(["/verifyOTP"], {
              queryParams: {
                type: this.type,
                token: res.data.token,
                mail: res.mail,
                from: "forgotpassword",
              },
            });
          } else {
            this.router.navigate(["/verifyOTP"], {
              queryParams: { token: res.data.token, mail: res.mail, from: "forgotpassword" },
            });
          }
        }
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
}
