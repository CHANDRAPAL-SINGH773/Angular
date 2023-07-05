import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { DatePipe } from "@angular/common";
import { pipe } from "rxjs";
import { Location } from "@angular/common";
import { noWhitespaceValidator } from "src/app/Shared/event-utils";
@Component({
  selector: "app-add-program",
  templateUrl: "./add-program.component.html",
  styleUrls: ["./add-program.component.scss"],
})
export class AddProgramComponent extends AuthorizationToken implements OnInit {
  coupenApplied: boolean = false;
  addprogramForm: FormGroup;
  loginError: any;
  errortext: any;
  categoryData: any;
  submitted: boolean = false;
  user_id: any;
  showImage: any = environment.urlBackend;
  imgsrc: any;
  imagefiles: any = [];
  verificationIdFiles: any;
  minDate = new Date().toISOString().split("T")[0];
  minimumPrice: number = 1;
  minimumExpiryDate: any;
  filesview: any;
  requestedProgramid: any = '';
  rewardData: any;
  page: number = 1;
  rewardId: any = '';
  valform: any;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,
    private datePipe: DatePipe,
    private location: Location
  ) {
    super();
    this.user_id = this.getLocalStorageID();

    this.addprogramForm = new FormGroup({
      mentorship_name: new FormControl("", [Validators.required,Validators.maxLength(40),noWhitespaceValidator()
        // ,Validators.pattern('/^[a-zA-Z0-9\s]*$/')
      ]),
      programcategory: new FormControl("", Validators.required),
      mode: new FormControl("1", Validators.required),
      experience: new FormControl("", Validators.required),
      price: new FormControl("", [Validators.required, Validators.min(1)]),
      noofmentee: new FormControl("", [Validators.required, Validators.min(1)]),
      startdate: new FormControl("", Validators.required),

      expirydate: new FormControl("", Validators.required),
      availibility_from: new FormControl(""),
      availibility_to: new FormControl(""),
      // payment_mode: new FormControl('', Validators.required),
      location: new FormControl("", [Validators.required,noWhitespaceValidator()]),
      description: new FormControl("", [Validators.required,Validators.maxLength(400),noWhitespaceValidator()]),
      image: new FormControl(""),
      skills: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.getAllCategoryDropdown();
    this.route.queryParams.subscribe((val: any) => {
      this.requestedProgramid = val._id;
    });
  }

  goBack(): void {
    this.location.back();
  }

  submitProgram() {
    this.valform=this.addprogramForm.valid
    this.submitted = true;
    if (!this.addprogramForm.valid) {
      return;
    }
    // let pipedate = this.datePipe.transform(this.addprogramForm.get('startdate')?.value);
    // console.log(pipedate, "pipedate");

    var formData: any = new FormData();
    formData.append(
      "mentorship_name",
      this.addprogramForm.get("mentorship_name")?.value
    );
    formData.append(
      "category_id",
      this.addprogramForm.get("programcategory")?.value
    );
    formData.append("mentorship_mode", this.addprogramForm.get("mode")?.value);
    formData.append("experience", this.addprogramForm.get("experience")?.value);
    formData.append("price", this.addprogramForm.get("price")?.value);
    formData.append(
      "mentee_limit",
      this.addprogramForm.get("noofmentee")?.value
    );
    formData.append("start_date", this.addprogramForm.get("startdate")?.value);
    formData.append(
      "availibility_from",
      this.addprogramForm.get("availibility_from")?.value
    );
    formData.append(
      "availibility_to",
      this.addprogramForm.get("availibility_to")?.value
    );
    formData.append(
      "expiry_date",
      this.addprogramForm.get("expirydate")?.value
    );
    formData.append(
      "description",
      this.addprogramForm.get("description")?.value
    );
    formData.append("location", this.addprogramForm.get("location")?.value);
    formData.append("user_id", this.user_id);
    formData.append("image", this.imagefiles);
    formData.append("skills", this.filesview);
    formData.append("newMentorshipId", this.requestedProgramid);
    formData.append("rewardId", this.rewardId); 
    this.mentorservice.addProgram(formData).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.submitted=false
          this.addprogramForm.reset();
          // || this.rewardId !=="undefined"
          if (this.rewardId || this.rewardId !== "") {
            let reqData = { _id: this.rewardId };
            this.mentorservice.deleteReward(reqData).subscribe(
              (res: any) => {
                if (res.status === "Success" && res.messageID === 200) {
                  // this.toastr.success(res.message, res.status)
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
          // this.router.navigate(['mentor/mentor-dashboard/mentorship']);
          // this.router.navigate(['mentor/mentor-dashboard/mentorship'],{ queryParams: { type: 'created' }, });
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
  handleimage(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      if (type === "image") {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imgsrc = event.target.result;
        };
        this.imagefiles = event.target.files[0];
      } else if (type === "skills") {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          // this.imgsrc = event.target.result;
          this.verificationIdFiles = event.target.result;
        };
        this.filesview = event.target.files[0];
      }
    }
  }

  getAllCategoryDropdown() {
    this.adminService.getAllCategoryDropdown().subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.categoryData = res.data;
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

  // showlocation(event: any) {
  //   if (event.target.value == 1) {
  //     this.showLocation = false
  //   } else {
  //     this.showLocation = true
  //   }
  // }
  changeDate(event: any) {
    this.minimumExpiryDate = event.target.value;
  }
  navigate() {
    this.router.navigate(["mentor/mentor-dashboard/mentorship"]);
  }
  getrewards() {
    let data = {
      filter: "",
      user_id: this.user_id,
      page: this.page,
    };
    this.mentorservice.getrewards(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.rewardData = res.data.docs;
          console.log(this.rewardData, "reward data check");
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

  // applyCoupen(id:any){

  //     this.coupenApplied = true;
  //     this.rewardId=id;
  // }
  // cancelCoupan() {
  //   this.rewardId=''
  // }
  applyCoupen(id: any) {
    this.coupenApplied = true;
    this.rewardId = id;
  }
  cancelCoupan() {
    this.rewardId = "";
    this.coupenApplied = false;
  }
}
