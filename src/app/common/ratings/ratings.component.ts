import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { Location } from "@angular/common";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { Math } from "core-js";

@Component({
  selector: "app-ratings",
  templateUrl: "./ratings.component.html",
  styleUrls: ["./ratings.component.scss"],
})
export class RatingsComponent extends AuthorizationToken implements OnInit {
  mentor_id: any;
  loginError: any;
  errortext: any;
  oneUserData: any = [];
  rating_page: any = 1;
  program_id: any;
  ratingData: any;
  showImage: any = environment.urlBackend;
  replyForm: FormGroup;
  submitted: boolean = false;
  ratingId: any;
  average: any;
  sessionAverageRating: any;
  ratingCounts : any = []
  maxCount = 3000; // Set this to the maximum count of any rating
  rateCounts=5;
getPercentage(count: number): number {
  return (count / this.maxCount) * 100;
}
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private mentorservice: MentorServiceService,
    private menteeService: MenteeService
  ) {
    super();
    this.mentor_id = this.getLocalStorageID();
    this.replyForm = new FormGroup({
      reply: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.program_id = val._id;
    });
    let data = {
      filter: "",
      program_id: this.program_id,
      page: this.rating_page,
    };
    console.log(data,"data")
    this.getRating(data);
   
  }
  getRating(data: any) {
    this.menteeService.getRating(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.ratingData = res.data.docs;
          this.sessionAverageRating = this.ratingData[0].averageRating
          ;
          console.log(
            "TCL: RatingsComponent -> getRating ->  this.ratingData ",
            this.ratingData
          );
          const ratingCounts = this.ratingData.reduce((counts:any, doc:any) => {
            const { rating } = doc;
            counts[rating] = (counts[rating] || 0) + 1;
            return counts;
          }, {});
          
          this.ratingCounts = Array.from({ length: 5 }, (_, i) => {
            const rating = i + 1;
            const count = ratingCounts[rating.toString()] || 0;
            return { rating, count };
          });
                 
          console.log("🚀 ~ file: ratings.component.ts:87 ~ RatingsComponent ~ this.ratingCounts=Object.entries ~ this.ratingCounts :", this.ratingCounts )
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.rating_page,
      program_id: this.program_id,
    };
    this.getRating(data);
  }
  goBack(): void {
    this.location.back();
  }
  getId(id: any) {
    this.ratingId = id;
  }
  reply() {
    this.submitted = true;
    if (!this.replyForm.valid) {
      return;
    }
    let body = {
      id: this.ratingId,
      reply: this.replyForm.get("reply")?.value,
    };

    this.menteeService.replyonComment(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          let data = {
            filter: "",
            program_id: this.program_id,
            page: this.rating_page,
          };
          this.getRating(data);
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }

  convertTimeFormat(time: string): string {
    const parts = time.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00'; // Set minutes to '00' if not provided
  
    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
  
    // Add leading zero for single-digit hours
    const formattedHoursString = formattedHours < 10 ? '0' + formattedHours : formattedHours.toString();
  
    return formattedHoursString + ':' + minutes + ' ' + period;
  }
}
