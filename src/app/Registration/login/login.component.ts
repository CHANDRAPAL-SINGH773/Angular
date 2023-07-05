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
import { CookieService } from 'ngx-cookie-service';
import { Authentication } from "src/app/Services/authentication";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  myjson = {};
  response: any;
  params: any;
  type: any;
  role: any;
  loginError: boolean = false;
  errortext: string = "";
  checked: boolean = false;
  password: string = "password";
  constructor(
    private router: Router, private cookieService: CookieService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private authService: AuthService,
    private auth:Authentication
  ) {

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

  }
  get f() { return this.loginForm.controls; }
  ngOnInit(): void {

    let token = this.auth.isLoggedIn();

    let role = this.auth.getRole();
    console.log(token,"PPPPPPP");
    if (token && role === 1) {
      this.router.navigate(['/mentor/mentor-dashboard'])
    }
    if (token && role === 2) {
      this.router.navigate(['/mentee/mentee-dashboard'])
    }
    if (token && role === 0) {
      this.router.navigate(['/admin-dashboard'])
    }
  //  else if (token && role == 2) {
  //     this.router.navigate(['/mentee/mentee-dashboard'])
  //   }
  //   else{
  //     this.router.navigate(['/admin-dashboard'])
  //   }

    this.route.queryParams.subscribe((val: any) => {
      this.type = val.type;
      if (this.type == "mentor") {
        this.role = 1;
      } else if (this.type == "mentee") {
        this.role = 2;
      } else {
        this.role = 0;
      }
    });

    var rememberMe = this.cookieService.get('rememberMe');
    if (rememberMe && rememberMe === 'true') {
      this.checked = true;
      let email = this.cookieService.get('email');
      let password = this.cookieService.get('password');
      this.loginForm.patchValue({
        email: email,
        password: password
      })
    }

  }

  login() {
    this.submitted = true
    if (!this.loginForm.valid) {
      return
    }


    let myjson: any = {
      password: this.loginForm.get("password")?.value,
      email: this.loginForm.get("email")?.value,
      role: this.role,
    };

    this.mentorservice.login(myjson).subscribe(
      (res: any) => {
        console.log("woking",res)
        if (res.status === "Success" && res.messageID === 200) {
          console.log(res.data, "jsffsjfjjk");

          let data = {
            token: res.data.token,
            role: res.data.role,
            name: res.data.name,
            _id: res.data._id,
            image: res.data.image,
            email: res.data.email,
            myreferalcode: res.data.myreferalcode,

          };
          localStorage.setItem("token", JSON.stringify({ data: data }));

          if (res.data.role === 2) {
            this.router.navigate(["/mentee/mentee-dashboard"], { replaceUrl: true });
            this.toastr.success(res.message, res.status);

          } else if (res.data.role === 0) {
            this.router.navigate(["/admin-dashboard"], { replaceUrl: true });
            this.toastr.success(res.message, res.status);
          }

          else {
            this.router.navigate(["/mentor/mentor-dashboard"], { replaceUrl: true });
            this.toastr.success(res.message, res.status);
          }
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
  forgotPassword() {
    this.router.navigate(["/forgot-password"], {
      queryParams: { type: this.type },
    });
  }

  signup() {
    // if (this.type == "mentor") {
    //   this.router.navigate(["/mentor-signup"], {
    //     queryParams: { type: this.type },
    //   });
    // } else if (this.type == "mentee") {
    //   this.router.navigate(["/mentee-signup"], {
    //     queryParams: { type: this.type },
    //   });
    // } else {
    //   this.router.navigate([""]);
    // }
    this.router.navigate(["/mentee-signup"], { queryParams: { type: this.type }, });
  }
  rememberMe(event: any) {
    // event.preventDefault();
    if (event.target.checked) {
      this.checked = true;
      this.cookieService.set('rememberMe', 'true');
      this.cookieService.set('email', this.loginForm.value.email);
      this.cookieService.set('password', this.loginForm.value.password);
    } else {
      this.checked = false;
      this.cookieService.delete('rememberMe');
      this.cookieService.delete('email');
      this.cookieService.delete('password');

    }

  }

  togglePassword() {
    if (this.password === "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }

  guestLogin() {
    let myjson: any = {
      password: "Admin@123",
      email: "guest@yopmail.com",
      role: 10,
    };

    this.mentorservice.login(myjson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          console.log(res.data, "jsffsjfjjk");


          let data = {
            token: res.data.token,
            role: res.data.role,
            name: res.data.name,
            _id: res.data._id,
            image: res.data.image,
            email: res.data.email,
            myreferalcode: res.data.myreferalcode,

          };
          console.log(res.data.myreferalcode, "res.data.myreferalcode");

          localStorage.setItem("token", JSON.stringify({ data: data }));

          if (res.data.role === 10) {
            this.toastr.success(res.message, res.status);
            this.router.navigate(["/mentee/mentee-dashboard"], { replaceUrl: true });
          }

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

}
