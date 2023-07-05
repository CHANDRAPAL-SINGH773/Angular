import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/Services/admin/admin.service";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { environment } from "src/environments/environment";
import { Location } from "@angular/common";
import { AuthorizationToken } from "src/app/Shared/token";
import { WebSocketService } from "src/app/Services/web-socket.service";
@Component({
  selector: "app-mentor-details",
  templateUrl: "./mentor-details.component.html",
  styleUrls: ["./mentor-details.component.scss"],
})
export class MentorDetailsComponent
  extends AuthorizationToken
  implements OnInit {
    loading:boolean = false;
  id: any;
  loginError: any;
  errortext: any;
  oneUserData: any = {};
  mentorshipData: any;
  imagecategory: any = environment.urlBackend;
  imgsrc: any;
  mentorship_page: any = 1;
  catid: any;
  programsData: any = [];
  loggedInId: any;
  ChatData: any;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService,
    private mentorservice: MentorServiceService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.id = val.user_id;
      this.loggedInId = this.getLocalStorageID();
    });

    this.getOneUser();
    // this.token = localStorage.getItem("token");
    // let dataToken = JSON.parse((this.token) || '{}');
    // this.id = dataToken.data._id;
    let data = {
      filter: "",
      id: this.id,
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);


    console.log(this.loggedInId, "pradeep");
  }

  getallDetails(data: any) {
   this.loading=false
    this.mentorservice.getmentorshipDetailsByCategory(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneUserData = res.data.docs;
          this.loading=true
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

  // createChatRoom(senderId: any, user_id: any) {
  //   console.log("information", senderId, user_id);

  //   const data = { senderId: senderId, user_id: user_id };

  //   this.adminService.getUser(this.id).subscribe((res: any) => {
  //     if (res.status === "Success" && res.messageID === 200) {
  //       this.oneUserData = res.data;


  //       this.imgsrc = `${this.oneUserData.image}` ? `${environment.urlBackend}${this.oneUserData.image}` : "../../assets/images/profile-img.jpg";
  //     }
  //   }), (err: any) => {
  //     let res = err.error
  //     if (res.status === "Failed" && res.messageID === 409) {
  //       this.toastr.error(res.message, res.status);
  //     } else if (res.status === "Failed" && res.messageID === 400) {
  //       this.toastr.error(res.message[0].msg, res.status);
  //     }
  //     this.webSocketService.accessChat(data);

  //     this.webSocketService.receivedCreatedRoom().subscribe((res: any) => {
  //       this.ChatData = res?.data;
  //       console.log(this.ChatData, "chat data");


  //       this.router.navigate([
  //         `/mentor/mentor-dashboard/chat/${this.ChatData._id}`,
  //       ]);
  //     });
  //   }

  // }


  createChatRoom(senderId: any, user_id: any) {
    console.log("information", "senderId, data.userData._id");

    const data = { senderId: senderId, user_id: user_id };

    this.webSocketService.accessChat(data);

    this.webSocketService.receivedCreatedRoom().subscribe((res: any) => {
      this.ChatData = res?.data;

      this.router.navigate([
        `/mentor/mentor-dashboard/chat/${this.ChatData._id}`,
      ]);
    });
  } 


  getmentorshipDetails(data: any) {
    this.mentorservice.getmentorshipDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.mentorshipData = res.data.docs;
        this.loading=true
        this.mentorshipData.map((e1: any) => {
          this.programsData = e1.docs
        })

        console.log(this.mentorshipData, " this.mentorshipData", this.programsData);


      }
    }),
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
  }
  getOneUser() {
    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneUserData = res.data;
          this.imgsrc = `${this.oneUserData.image}`
            ? `${environment.urlBackend}${this.oneUserData.image}`
            : "../../assets/images/profile-img.jpg";
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

  // getmentorshipDetails(data: any) {
  //   this.mentorservice.getmentorshipDetails(data).subscribe(
  //     (res: any) => {
  //       if (res.status === "Success" && res.messageID === 200) {
  //         this.mentorshipData = res.data.docs;
  //         console.log(this.mentorshipData, " this.mentorshipData");
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
  selectOption(event: any) {
    let data = {
      filter: "",
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);
  }
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
    };

    this.mentorservice.getmentorshipDetails(data).subscribe((res: any) => { });
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);
  }
  goBack() {
    this.location.back();
  }
}
