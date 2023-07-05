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
import { noWhitespaceValidator } from "src/app/Shared/event-utils";
import { contactCountryCode } from '../../Shared/event-utils';

@Component({
  selector: "app-mentor-signup",
  templateUrl: "./mentor-signup.component.html",
  styleUrls: ["./mentor-signup.component.scss"],
})
export class MentorSignupComponent implements OnInit {

  contactCountryCodes: any[] = contactCountryCode;
  signupForm: FormGroup;
  submitted: boolean = false;
  myjson = {};
  response: any;
  types: any;
  signupdata: any;
  token: any;
  loginError: any;
  errortext: any;
  password: string = "password";
  content: any=[];
  constructor(
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signupForm = new FormGroup({
      referralCode: new FormControl(""),
      firstName: new FormControl("", [Validators.required,Validators.maxLength(20),noWhitespaceValidator()]),
      lastName: new FormControl("", [Validators.required,Validators.maxLength(20),noWhitespaceValidator()]),
      email: new FormControl("", [Validators.required, Validators.email]),
      country_code: new FormControl("+1", [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      role: new FormControl(""),
    });
  }
  get f() {
    return this.signupForm.controls;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.types = val.type;
    });
  }

  SignUp() {
    this.submitted = true;
    if (!this.signupForm.valid) {
      return;
    }

    let myjson: any = {
      referralCode: this.signupForm.get("referralCode")?.value.trim(),
      firstName: this.signupForm.get("firstName")?.value.trim(),
      lastName: this.signupForm.get("lastName")?.value.trim(),
      email: this.signupForm.get("email")?.value,
      country_code: this.signupForm.get("country_code")?.value,
      phone: this.signupForm.get("phone")?.value,
      role: 1,
      password: this.signupForm.get("password")?.value,
    };
    this.mentorservice.signUpMentor(myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.token = res.data.token;
          this.router.navigate(["/verifyOTP"], {
            queryParams: {
              token: this.token,
              type: this.types,
              mail: this.signupForm.get("email")?.value,
            },
          });
        } else if (res.status === "failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else {
          this.toastr.error(res.message, res.status);
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
  gotoLogin() {
    this.router.navigate(["/login"], { queryParams: { type: this.types } });
  }
  togglePassword() {
    if (this.password === "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }

  getStaticPages(type: string) {
    let body = {
      type: type,
    };
    this.mentorservice.getStaticPages(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.content = res.data;
          console.log(this.content, "content");
          // Open the popup/modal here using the retrieved content
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          // Handle specific error cases if needed
        } else if (res.status === "Failed" && res.messageID === 400) {
          // Handle specific error cases if needed
        } else if (res.status === "Failed" && res.messageID === 404) {
          // Handle specific error cases if needed
        } else {
          this.loginError = true;
          this.errortext = res.message;
          this.toastr.error(res.message, res.status);
        }
      }
    );
  }

  stripTags(html: any) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
  }
}
