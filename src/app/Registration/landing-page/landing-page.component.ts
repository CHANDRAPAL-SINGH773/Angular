import { Component, OnInit } from "@angular/core";
import { MentorServiceService } from "../../Services/mentor/mentor-service.service";
import { AuthService } from "src/app/Services/auth/auth.service";
import { environment } from 'src/environments/environment';

import { Authentication } from "src/app/Services/authentication";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  loginError: any;
  errortext: any;
  mentorData:any;
  showImage: any = environment.urlBackend;

  role: number = 1;
  constructor(
    private mentorService: MentorServiceService,
    private authService: AuthService,
    private auth:Authentication,
    private router: Router,
  ) {}

  ngOnInit(): void {

    let token = this.auth.isLoggedIn();

    let role = this.auth.getRole();
    if (token && role === 1) {
      this.router.navigate(['/mentor/mentor-dashboard'])
    }
    if (token && role === 2) {
      this.router.navigate(['/mentee/mentee-dashboard'])
    }
    if (token && role === 0) {
      this.router.navigate(['/admin-dashboard'])
    }
    this.allMentorCount();

  }

  allMentorCount() {
    this.authService.allMentorCount().subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.mentorData = res.data
          console.log(     this.mentorData,"this.mentorData")
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          // this.authService.verifyOTP(res.token).subscribe((res1:any) => { });
          // this.router.navigate(["/"]);
        } else if (res.status === "Failed" && res.messageID === 400) {
        } else if (res.status === "Failed" && res.messageID === 404) {
        } else {
          this.loginError = true;
          this.errortext = res.message;
        }
      }
    );
  }
}
