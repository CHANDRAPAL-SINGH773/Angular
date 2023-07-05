import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { Router, ActivatedRoute } from "@angular/router";
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { noWhitespaceValidator } from 'src/app/Shared/event-utils';
import { contactCountryCode } from '../../Shared/event-utils';

@Component({
  selector: 'app-mentee-signup',
  templateUrl: './mentee-signup.component.html',
  styleUrls: ['./mentee-signup.component.scss']
})
export class MenteeSignupComponent implements OnInit {
  contactCountryCodes: any[] = contactCountryCode;
  signupmenteeForm: FormGroup;
  submitted: boolean = false;
  myjson = {};
  response: any;
  signupdata: any;
  type: any;
  token: any;
  loginError: any;
  errortext: any;
  password: string = "password";
  content:any=[];
  constructor(private toastr: ToastrService, private mentorservice: MenteeService, private router: Router, private  mentorService: MentorServiceService,
    private route: ActivatedRoute,) {
    this.signupmenteeForm = new FormGroup({
      referralCode: new FormControl(''),
      firstName: new FormControl('', [Validators.required,Validators.maxLength(20),
        noWhitespaceValidator()]),
      lastName: new FormControl('', [Validators.required,Validators.maxLength(20),
        noWhitespaceValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      country_code: new FormControl('+1', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl(''),
      // lat:new FormControl(''),
      // lng:new FormControl(''),
    });
  }
  // onlyNumbersAllowed(event) 

  get f() { return this.signupmenteeForm.controls; }

  lat:any;
  lng:any;
 
  ngOnInit(): void {

    this.route.queryParams.subscribe((val: any) => {
      this.type = val.type;
    })
    
    // this.getLocation();
  }

  SignUp() {
    this.submitted = true
    if (!this.signupmenteeForm.valid) {
      return
    }
    // var formData: any = new FormData();
    // formData.append("referralCode", this.signupmenteeForm.get('referralCode')?.value);
    // formData.append("firstName", this.signupmenteeForm.get('firstName')?.value);
    // formData.append("lastName", this.signupmenteeForm.get('lastName')?.value);
    // formData.append("email", this.signupmenteeForm.get('email')?.value);
    // formData.append("country_code", +1);
    // formData.append("phone", this.signupmenteeForm.get('phone')?.value);
    // formData.append("password", this.signupmenteeForm.get('password')?.value);
    // formData.append("referralCode", this.signupmenteeForm.get('referralCode')?.value);
    // formData.append("role", 2);
    // formData.append("image", this.files);


    let myjson: any = {
      referralCode: this.signupmenteeForm.get("referralCode")?.value.trim(),
      firstName: this.signupmenteeForm.get("firstName")?.value.trim(),
      lastName: this.signupmenteeForm.get("lastName")?.value.trim(),
      email: this.signupmenteeForm.get("email")?.value,
      country_code: this.signupmenteeForm.get("country_code")?.value,
      phone: this.signupmenteeForm.get("phone")?.value,
      role: 2,
      password: this.signupmenteeForm.get("password")?.value,
      // lat: this.lat,
      // lng: this.lng,

    }
    this.mentorservice.signUpMentee(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.token = res.data.token
        this.router.navigate(['/verifyOTP'], { queryParams: { token: this.token, type: this.type,mail: this.signupmenteeForm.get("email")?.value  } })

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

  gotoLogin() {
    this.router.navigate(["/login"], { queryParams: { type: this.type }, });
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
    this.mentorService.getStaticPages(body).subscribe(
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

  // getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position: any) => {
  //       if (position) {
  //         console.log("Latitude: " + position.coords.latitude +
  //           "Longitude: " + position.coords.longitude);
  //         this.lat = position.coords.latitude;
  //         this.lng = position.coords.longitude;
  //         console.log(this.lat);
  //         console.log(this.lat);
  //       }
  //     },
  //       (error: any) => console.log(error));
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }
}
