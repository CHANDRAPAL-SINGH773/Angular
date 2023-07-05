import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { WebSocketService } from "src/app/Services/web-socket.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-mentor-session-detail",
  templateUrl: "./mentor-session-detail.component.html",
  styleUrls: ["./mentor-session-detail.component.scss"],
})
export class MentorSessionDetailComponent
  extends AuthorizationToken
  implements OnInit {
  ids: string = "Sessions";
  programid: any;
  loginError: any;
  errortext: any;
  allData: any;
  detailPage: any = 1;
  user_id: any;
  showImage: any = environment.urlBackend;
  imagedata: any;
  sessiondetails: any;
  data1: any = [];
  showHeading: any;
  singleData: any = {};
  programName: any;
  registerMetees: any;
  userId: any = [];
  programImage: any;
  showChatIcon: boolean = true;
  registerMentees: any;
  oneUserData: any;
  totaldocs: any = 0;
  _id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private webSocketservice: WebSocketService,
    private location: Location,
    private adminService: AdminService
  ) {
    super();
    this.user_id = this.getLocalStorageID();
  }
  changeTab(ids: string) {
    this.ids = ids;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.programid = val._id;
      this.showHeading = val.category;
    });
    let data = {
      filter: "",
      program_id: this.programid,
      mentorid: this.user_id,
      page: this.detailPage,
    };
    this.getallDetails(data);
    this.getSingleProgram();
    this.groupChatResponse();
    // this.getProgramsForRating(data);
  }

  groupChatResponse() {
    this.webSocketservice.accessGroupInfo().subscribe((res: any) => {
      console.log(res, "res");
    });
  }

  createGroupFuntion() {
    console.log(this.programImage, "getSingleProgramgetSingleProgram");
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
            chatImage: this.programImage,
            users: userArray,

            isGroupChat: true,
            groupAdmin: this.user_id,
            groupDetails: {
              name: this.programName,
              image: this.programImage,
            },
            identificationID: this.user_id,
            program_id: this.programid,
          };
          console.log(data, "data dekho");

          this.webSocketservice.createGroup(data);
        }
      });

    this.webSocketservice.accessGroupInfo().subscribe((res: any) => {
      res?.data?._id;

      this.router.navigate([`/mentor/mentor-dashboard/chat/${res?.data?._id}`]);
    });
  }

  getallDetails(data: any) {
    this.mentorservice.getallprogramDetails(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.allData = res.data.docs;

          this.totaldocs = res.data.totalDocs;

          this.allData.map((t1: any) => {
            this.data1 = t1.mentor_data;
            console.log(this.data1, "<<<<<");

          });
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

  getSingleProgram() {
    this.mentorservice.getSingleProgram(this.programid).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.singleData = res.data;


          this.registerMentees = res.registerMentee;
          // if(res.registerMentee == 0 || !res.registerMentee){
          //   this.showChatIcon=false;
          //   console.log( this.showChatIcon," this.showChatIcon");

          // }
          if (
            this.singleData.RegisterMentee &&
            this.singleData.RegisterMentee.length > 0
          ) {
            this.singleData.RegisterMentee.map((e1: any) => {
              this.userId.push({ userId: e1.user_id, status: 1 });
            });
            console.log(this.userId, "A");
          }

          this.registerMetees = res.registerMentee;

          this.programName = this.singleData.mentorship_name;
          this.programImage = this.showImage + this.singleData.image;
          console.log(this.programName, "this.programName", this.programImage);
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
  selectOption(event: any) {
    let data = {
      filter: "",
      page: this.detailPage,
    };
    this.getallDetails(data);
  }
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
      program_id: this.programid,
      mentorid: this.user_id,
    };
    this.detailPage = page;
    this.mentorservice.getallprogramDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.allData = res.data.docs;
        console.log(res.data, "userDta check");

        this.totaldocs = res.data.totalDocs;
        // this.patchValues()
      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
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
    });
  }
  back() {
    this.location.back();
  }

  cancelSession() {
    this.mentorservice.cancelProgram(this.programid).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.router.navigate(["/mentor/mentor-dashboard/mentorship"]);
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

  // getProgramsForRating(data: any) {
  //   this.mentorservice.getProgramsForRating(data).subscribe(
  //     (res: any) => {
  //       if (res.status === "Success" && res.messageID === 200) {
  //         // this.count = res.data;
  //         this.oneUserData = res.data.docs;
  //         this._id = this.oneUserData._id
  //         console.log("🚀 ~ file: mentor-session-detail.component.ts:289 ~ MentorSessionDetailComponent ~ getProgramsForRating ~ this._id:", this._id)

  //       }
  //     },
  //     (err: any) => {
  //       let res = err?.error;
  //       if (res?.status === "Failed" && res?.messageID === 409) {
  //         this.toastr.error(res?.message, res?.status);
  //       } else if (res?.status === "Failed" && res?.messageID === 400) {
  //         this.toastr.error(res?.message[0].msg, res?.status);
  //       } else if (res?.status === "Failed" && res?.messageID === 404) {
  //         this.toastr.error(res?.message, res?.status);
  //       } else {
  //         this.loginError = true;
  //         this.errortext = res?.message;
  //         this.toastr.error(res?.message, res?.status);
  //       }
  //     }
  //   );
  // }
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
