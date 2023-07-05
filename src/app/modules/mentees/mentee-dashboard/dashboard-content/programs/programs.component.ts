import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { Location } from "@angular/common";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { FormGroup } from "@angular/forms";
import { log } from "console";
import { WebSocketService } from "src/app/Services/web-socket.service";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { take } from "rxjs/operators";
@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.scss"],
})
export class ProgramsComponent extends AuthorizationToken implements OnInit {
  ids: string = "program";
  loginError: any;
  errortext: any;
  allData: any = {};
  programid: any;
  sessionDetail: any;
  showImage: any = environment.urlBackend;
  mentorid: any;
  detailPage: any = 1;
  mydata: any;
  submitted: boolean = false;
  user_id: any;
  registerMetees: number = 0;
  availableSlots: number = 0;
  unbleBooking: boolean = false;
  singleData: any = {};

  disblebookButton: boolean = false;
  role: any;
  page: number = 1;
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  customerId = "";
  coupenApplied: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        padding: "0.5rem !important",
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "en",
  };

  stripeTest: any = FormGroup;
  cardDetails: any = [];
  rewardData: any = [];
  finalAmount!: number;
  rewardId: any = "";
  programName: any;
  cardid: any;
  rating:any;
  // rating: any = [];
  pastProgramCount: any;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menteeService: MenteeService,
    private stripeService: StripeService,
    private webSocketservice: WebSocketService,
    private mentorservice: MentorServiceService
  ) {
    super();
    this.user_id = this.getLocalStorageID();
    this.role = this.getLocalStorageRole();
  }
  showMessage() {
    this.toastr.info("You need to log in to access additional features")
  }
  ngOnInit(): void {
    console.log(this.finalAmount, "finalAmount");

    this.route.queryParams.subscribe((val: any) => {
      this.programid = val.programid;
    });
    this.programAndMentorDetail();
    this.getCardDetails();
  }
  bookProgram() {
    let body = {
      _id: this.programid,
      ref_id: this.user_id,
      amount: this.allData.price,
      payment_status: true,
      status: true,
    };
    console.log(body, "body");

    this.menteeService.bookProgram(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
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
  getwholeProgramdetail() {
    this.menteeService.getwholeProgramdetail(this.mydata).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.sessionDetail = res.data.docs;
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

  navigate() {
    this.router.navigate(["/mentee/mentee-dashboard"]);
  }
  programAndMentorDetail() {
    this.menteeService.programAndMentorDetail(this.programid).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.allData = res.data;
        console.log(this.allData, "this.allData ")
        this.allData.RegisterMentee.map((ele: any) => {
          if (this.user_id === ele.user_id) {
            this.disblebookButton = true
          }
          console.log(this.user_id, "this.user_idthis.user_id");

        })
        this.registerMetees = res.registerMetees;
        this.availableSlots = (this.allData.mentee_limit - this.registerMetees)
        console.log(" this.availableSlots ", this.availableSlots);

        this.mentorid = this.allData.user_id._id
        console.log(this.mentorid, "this.mentorid")
        this.mydata = {
          filter: "",
          program_id: this.programid,
          mentorid: this.mentorid,
          page: this.detailPage,
        };

        this.getwholeProgramdetail()
        this.updateMentorRatingCount();

        this.programAndMentorDetailTotalcount();

        // this.getwholeProgramdetail();
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
  changeTab(ids: string) {
    this.ids = ids;
  }
  goBack(): void {
    this.location.back();
  }

  createGroupFuntion() {
    // console.log(this.programImage, "getSingleProgramgetSingleProgram");
    let userArray: any = [];
    userArray.push({
      userId: this.user_id,
      status: 1,
    });
    this.mentorservice
      .getSingleProgram(this.programid)
      .subscribe((res: any) => {
        console.log("cgec", res);
        if (res.status === "Success" && res.messageID === 200) {
          this.singleData = res.data;
          if (
            this.singleData.RegisterMentee &&
            this.singleData.RegisterMentee.length > 0
          ) {
            this.singleData.RegisterMentee.map((e1: any) => {
              userArray.push({ userId: e1.user_id, status: 1 });
            });
            console.log(userArray, "A");
          }

          this.registerMetees = res.registerMentee;

          this.programName = this.singleData.mentorship_name;
          console.log(this.programName, "this.programName");

          let data = {
            chatName: this.programName,
            chatImage: "this.programImage,,",
            users: userArray,
            // users: [

            //   {
            //     userId: "63db99404a465b1ee8250423",
            //     status: 0
            //   },
            //   {
            //     userId: "63db99404a465b1ee8250423",
            //     status: 0
            //   },
            //   {
            //     userId: "63dc9faf589d51d223607391",
            //     status: 0
            //   },
            //   {
            //     userId: "63db98454a465b1ee8250412",
            //     status: 0
            //   },

            // ],
            isGroupChat: true,
            groupAdmin: this.user_id,
            groupDetails: {
              name: this.programName,
              image: "this.programImage",
            },
            identificationID: this.user_id,
            program_id: this.programid,
            role: 2,
            menteeId: this.user_id
          };
          console.log(data, "data dekho");

          this.webSocketservice.createGroup(data);
        }
      });

    // Declare a flag variable to track toastr display
    let toastrDisplayed = false;

    this.webSocketservice.accessGroupInfo().subscribe((res: any) => {
      if (res.messageID == 400) {
        if (!toastrDisplayed) {
          this.toastr.error(res.message);
          toastrDisplayed = true; // Set the flag to true after displaying toastr
        }
      } else {
        this.router.navigate([
          `/mentor/mentor-dashboard/chat/${res?.data?._id}`,
        ]);
      }
    });
  }
  getid(id: any) {
    console.log(id, "id");

    this.cardid = id

  }

  cardSelected(): void {

 
    if (this.cardid) {
      let body = {
        card_id: this.cardid,
        amount: this.finalAmount ? this.finalAmount : this.allData.price,
        program_id: this.programid,
        mentor_id: this.mentorid,
        rewardId: this.rewardId
      };
      this.menteeService.createPayment(body).subscribe((res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.router.navigate(["mentee/mentee-dashboard"]);
          if (this.rewardId || this.rewardId !== "") {
            console.log(this.rewardId, "this.rewardId");
            let reqData = { _id: this.rewardId };
            this.menteeService.deleteReward(reqData).subscribe(
              (res: any) => {
                if (res.status === "Success" && res.messageID === 200) {
                  // this.toastr.success(res.message, res.status);
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
        } else {
          this.toastr.error(res.message, res.status);
        }
      });
    }
    //  else if (result.error) {
    //   this.toastr.error(result.error.toString(), "Failed");
    // }

  }




  getCardDetails() {

    console.log("this.user_id",this.user_id)
    this.menteeService.getCardDetails(this.user_id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.cardDetails = res.data.data;
        console.log(this.cardDetails, "cardDetailscardDetails");

      }
    });
  }

 customer_payment_id:any  
getDeleteCardDetails(customer_payment_id: any, cardId: any) {
  this.cardid=cardId;
  this.customer_payment_id=customer_payment_id

  console.log(customer_payment_id,cardId)
}

  deleteCard() {
    let body = {
      customer_payment_id: this.customer_payment_id,
      cardId: this.cardid,
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

  getrewards() {
    let data = {
      filter: "",
      user_id: this.user_id,
      page: this.page,
    };
    this.menteeService.getrewards(data).subscribe(
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

  applyCoupen(rewards: any, price: number) {
    console.log(rewards._id, "id", rewards.percentOff, "price", price);
    this.coupenApplied = true;
    let offValue = (price * rewards.percentOff) / 100;
    console.log(offValue, "offValue");
    this.rewardId = rewards._id;
    this.finalAmount = price - offValue;
    console.log(this.finalAmount, "this.finalAmount");
  }

  cancelCoupan() {
    console.log("check");
    this.rewardId = "";
    this.coupenApplied = false;
    this.finalAmount = this.allData.price;
  }

  updateMentorRatingCount() {
    let id = {
      "user_id": this.mentorid
    }
    console.log
    this.mentorservice.updateMentorRatingCount(id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.rating = res.data.rating;
        console.log(this.rating,"this.rating")
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
      })
  }

  programAndMentorDetailTotalcount() {
    // this.user_id = this.mentorid
    this.menteeService.programAndMentorDetailTotalcount(this.mentorid).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.pastProgramCount = res.data;
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


