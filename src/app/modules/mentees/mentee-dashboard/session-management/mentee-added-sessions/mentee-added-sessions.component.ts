import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { AgmMap } from "@agm/core";
import { Location } from "@angular/common";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { onlyNumbersAllowed } from "src/app/Shared/event-utils";
@Component({
  selector: "app-mentee-added-sessions",
  templateUrl: "./mentee-added-sessions.component.html",
  styleUrls: ["./mentee-added-sessions.component.scss"],
})
export class MenteeAddedSessionsComponent
  extends AuthorizationToken
  implements OnInit
{
  cardid: any;
  present: boolean = false;
  canTrack: boolean = false;
  userList: any = [];
  online: boolean = false;
  loginError: any;
  errortext: any;
  id: any;
  pid: any;
  isTodayDateGreaterThanTrimDate: boolean = true;
  oneSessionDetail: any = {};
  imgsrc: any = "";
  showImage: any = environment.urlBackend;
  mode: any;
  cardDetails: any = [];
  user_id: any;
  tipForm: FormGroup;
  submitted: boolean = false;
  mylist: Array<string> = [];
  logedinName: string;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  customerId = "";
  sharelocationForm: FormGroup;
  shareDetail: any;
  trimDate: any;
  todayDate: any;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        // borderWidth: '1px',

        // borderRadius: '0.375rem !important',
        padding: "0.5rem !important",
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "es",
  };
  programid: any;
  mentorid: any;
  mentorID: any;
  cancelByMentee: any = [];
  sessionCanceled: boolean = false;
  location: any;
  attendanceList: any = [];
  render: Boolean = false;
  type: any;
  // today = new Date().toISOString();

  constructor(
    private pageLocation: Location,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private clipboardApi: ClipboardService,
    private mentorService: MentorServiceService,
    private menteeService: MenteeService,
    private datePipe: DatePipe,
    private stripeService: StripeService
  ) {
    super();
    this.user_id = this.getLocalStorageID();
    this.logedinName = this.getLocalStorageByName();
    this.tipForm = new FormGroup({
      amount: new FormControl("", [Validators.required, Validators.min(1)]),
    });
    this.sharelocationForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      description: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.id = val.session_id;
      this.mode = val.mode;
      this.type = val.type;
      this.getOneDaywise();
      this.getCardDetails();
    });
    this.getAttendance();
  }
  createToken(): void {
    this.submitted = true;
    if (!this.tipForm.valid) {
      this.toastr.error("Amount should be greater than 0");
      return;
    }
    this.stripeService
      .createToken(this.card.element)
      .subscribe((result: any) => {
        if (result.token) {
          let body = {
            cardtoken: result.token.id,
            amount: this.tipForm.get("amount")?.value,
            program_id: this.programid,
            mentor_id: this.user_id,
          };

          this.menteeService.makeTip(body).subscribe((res: any) => {
            if (res.status === "Success" && res.messageID === 200) {
              this.toastr.success(res.message, res.status);
            } else {
              this.toastr.error(res.message, res.status);
            }
          });
        } else if (result.error) {
          this.toastr.error(result.error.toString(), "Failed");
        }
      });
  }

  copyText() {
    this.toastr.show("Session link copied");
    this.clipboardApi.copyFromContent(this.oneSessionDetail.session_link);
  }

  getOneDaywise() {
    this.mentorService.getOneDaywise(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneSessionDetail = res.data;
          this.render = true;
          this.cancelByMentee = res.data.cancelByMentee;
          this.cancelByMentee.map((e1: any) => {
            if (e1.userId === this.user_id) {
              this.sessionCanceled = true;
            }
          });

          let today = new Date();

          let formattedDate = this.datePipe.transform(
            today,
            "yyyy-MM-ddT00:00:00.000Z"
          );
          this.trimDate = this.oneSessionDetail.start_date.split("T")[0];
          this.todayDate = formattedDate?.split("T")[0];

          if (this.trimDate === this.todayDate) {
            this.canTrack = true;
          } else {
            this.canTrack = false;
          }

          if (this.todayDate > this.trimDate) {
            this.isTodayDateGreaterThanTrimDate = false;
          } else {
            this.isTodayDateGreaterThanTrimDate = false;
          }

          this.shareDetail = `
          Program Name - ${this.oneSessionDetail.program_id.mentorship_name}
          Session Name - ${this.oneSessionDetail.session_name}
          Start Time - ${this.oneSessionDetail.time}
          Meeting Location- ${this.oneSessionDetail.location}`;
          this.programid = this.oneSessionDetail.program_id._id;
          this.mentorid = this.oneSessionDetail.user_id;
          this.imgsrc = `${this.oneSessionDetail.image}`
            ? `${environment.urlBackend}${this.oneSessionDetail.image}`
            : "../../../../../assets/images/uploadProfile.png";
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
  getCardDetails() {
    this.menteeService.getCardDetails(this.user_id).subscribe((res: any) => {
      console.log(res, "check enter");
      if (res.status === "Success" && res.messageID === 200) {
        this.cardDetails = res.data.data;
      }
    });
  }
  deleteCard(customer_payment_id: any, cardId: any) {
    let body = {
      customer_payment_id: customer_payment_id,
      cardId: cardId,
    };
    this.menteeService.deleteCard(body).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.getCardDetails();
        // this.router.navigate(["mentee/mentee-dashboard"]);
      } else {
        this.toastr.error(res.message, res.status);
      }
    });
  }
  getid(id: any) {
    this.submitted = true;
    if (!this.tipForm.valid) {
      this.toastr.error("Amount should be greater than 0");
      return;
    }

    console.log(id, "id");

    this.cardid = id;
  }
  cardSelected(): void {
    if (this.cardid) {
      let body = {
        card_id: this.cardid,
        amount: this.tipForm.get("amount")?.value,
        program_id: this.programid,
        mentor_id: this.mentorid,
        // rewardId:""
        // cardtoken: result.token.id,
      };
      this.menteeService.makeTip(body).subscribe((res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success("Thank you! tip sent Successfully");
          this.submitted = false;
          this.tipForm.reset();
          // this.router.navigate(["mentee/mentee-dashboard"]);
        } else {
          this.toastr.error(res.message, res.status);
        }
      });
    }
    //  else if (result.error) {
    //   this.toastr.error(result.error.toString(), "Failed");
    // }
  }
  cancelMeeting() {
    // this.buttonClicked = true;
    let newProgramData = {
      session_id: this.id,
      program_id: this.programid,
      user_id: this.user_id,
    };
    this.menteeService.cancelMeeting(newProgramData).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.getOneDaywise();
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

  goTomap() {
    this.pid = this.programid;
    let sid = this.id;
    this.router.navigate(["/showmap"], {
      queryParams: { pid: this.pid, sid: sid },
    });
  }

  sendEmail() {
    this.submitted = true;
    if (!this.sharelocationForm.valid) {
      return;
    }

    let emailFields = {
      email: this.sharelocationForm.get("email")?.value,
      description: this.shareDetail,
      userId: this.id,
    };

    this.menteeService.shareLocation(emailFields).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success("Email sent successfully");
          this.submitted=false;
          this.sharelocationForm.reset();
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

  markAttendance() {
    let allData = {
      attendedMentee: this.user_id,
      sessionId: this.id,
      programId: this.programid,
      mentorID: this.mentorid,
      markedBy: "mentee",
    };

    this.mentorService.menteeattendance(allData).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.getAttendance();
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

  getAttendance() {
    this.mentorService.getAttendance(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          // this.toastr.success(res.message, res.status,);
          let attendanceData = res.data.markedBy;
          console.log(attendanceData, "attendanceData");

          this.attendanceList = res.data.attendedMentee;
          this.attendanceList.map((ele: any) => {
            if (this.user_id.includes(ele)) {
              this.present = true;
            }
          });
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
          // this.toastr.error(res.message, res.status);
        }
      }
    );
  }
  back() {
    this.pageLocation.back();
  }
  onlyNumbers(event:any) {
    onlyNumbersAllowed(event)
  }
}
