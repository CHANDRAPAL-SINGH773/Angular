import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from "src/app/Services/auth/auth.service";
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean = false;
  myjson = {};
  response: any;
  params: any;
  type: any;
  password: string = "password";
  loginError: boolean = false;
  errortext: string = '';
  checked: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private mentorservice: MentorServiceService,private cookieService:CookieService, private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {

    var rememberMe = this.cookieService.get('rememberMe');
    if(rememberMe && rememberMe === 'true'){
      this.checked = true;
      let email = this.cookieService.get('email');
      let password = this.cookieService.get('password');
      this.loginForm.patchValue({
        email:email,
        password:password
      })
    }
  }
  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  loginAdmin() {
    this.submitted = true
    if (this.loginForm.invalid) {
      return
    }
    let myjson: any = {
      password: this.loginForm.get("password")?.value,
      email: this.loginForm.get("email")?.value,
      role: 0
    }

    this.mentorservice.login(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
     let data={   token: res.data.token,
          role: res.data.role,
           name: res.data.name,
           _id: res.data._id,
          }
        localStorage.setItem("token", JSON.stringify({data:data})
        );

      
        if (res.data.role === 2) {
          this.toastr.success(res.message, res.status);
          this.router.navigate(["/mentee/mentee-dashboard"], { replaceUrl: true });

        } else if(res.data.role === 0){
          this.toastr.success(res.message, res.status);
          this.router.navigate(["/admin-dashboard"], { replaceUrl: true });
        }
        
        else {
          this.toastr.success(res.message, res.status);
          this.router.navigate(["/mentor/mentor-dashboard"], { replaceUrl: true });
        }

      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
        // this.authService.verifyOTP(res.token).subscribe((res1:any) => { });
        // this.router.navigate(["/"]);
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

  signup() {
    if (this.type == "mentor") {
      this.router.navigate(["/mentor-signup"], {
        queryParams: { type: this.type },
      });
    } else if (this.type == "mentee") {
      this.router.navigate(["/mentee-signup"], {
        queryParams: { type: this.type },
      });
    } else {
      this.router.navigate([""]);
    }
  }

  togglePassword() {
    if (this.password === "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }
  rememberMe(event:any) {
    // event.preventDefault();
    if(event.target.checked){
      this.checked = true;
      this.cookieService.set('rememberMe', 'true');
      this.cookieService.set('email', this.loginForm.value.email);
      this.cookieService.set('password', this.loginForm.value.password);
    }else{
      this.checked = false;
      this.cookieService.delete('rememberMe');
      this.cookieService.delete('email');
      this.cookieService.delete('password');
    }
  }
}
