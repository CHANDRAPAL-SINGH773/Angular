import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/Services/auth/auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loginError: any;
  errortext: any;
  token: any;
  type: any;
  validatepassword: any;
  confirmePassword: any;
  passwordReset: boolean = false;
  submitted: boolean = false;
  text: string = "text";
  password: string = "password";
  conf: string = "password";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private authService: AuthService
  ) {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      confirmePassword: new FormControl("", [Validators.required]),
    });
  }
  get f() { return this.resetPasswordForm.controls; }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.token = val.token;
      this.type = val.type;
    });
  }
  resetPassword() {
    this.submitted = true
    if (!this.resetPasswordForm.valid) {
      return
    }
    this.validatepassword = this.resetPasswordForm.get("password")?.value;
    this.confirmePassword =
      this.resetPasswordForm.get("confirmePassword")?.value;
    if (this.confirmePassword != this.validatepassword) {
      this.toastr.error("Password did not match!");
      return
    }

    let myjson: any = {
      password: this.resetPasswordForm.get("password")?.value,
    };
    this.authService.resetPassword(this.token, myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.responseCode === 200) {
          this.toastr.success(res.message, res.status);

          this.passwordReset = true;

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
  goTOLogin() {
    if (this.type) {
      this.router.navigate(["/login"], {
        queryParams: { type: this.type },
      });
    } else {
      this.router.navigate(["/admin-login"]);
    }
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

}
