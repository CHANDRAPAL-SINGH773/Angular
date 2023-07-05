import { Component, OnInit } from "@angular/core";
import { ToggleMenuService } from "src/app/Services/toggle-menu.service";
import { Router } from "@angular/router";
import { AuthorizationToken } from "../../Shared/token";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { WebSocketService } from "src/app/Services/web-socket.service";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { AuthService } from "src/app/Services/auth/auth.service";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent extends AuthorizationToken implements OnInit {
  clicked: boolean = true;
  notification: boolean = false;
  name: any;
  role: any;
  id: any;
  oneUserData: any;
  loginError: any;
  errortext: any;
  showImage: any = environment.urlBackend;
  url: any;
  allNotifications: any;
  notificationsCount: any;
  notificationDisplayed = false;
  mynotification: any;
  count: any;
  myarray: any;

  constructor(
    private _service: ToggleMenuService,
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService,
    private webSocket: WebSocketService,
    private menteeService: MenteeService,
    private mentorService: MentorServiceService
  ) {
    super();
    this.id = this.getLocalStorageID();

    this.role = this.getLocalStorageRole();
    this._service.clicked.subscribe((res: boolean) => {
      this.clicked = res;
    });
    this.webSocket.connect();
    this.realTimeNotification();
  }
  trigermenu() {
    this.clicked = !this.clicked;
    this._service.clicked.next(this.clicked);
  }
  ngOnInit(): void {
    this.getoneUser();
    this.url = this.router.url;
    this.getNotifications();
    // this.getNotificationForReciver()
  }
  getoneUser() {
    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneUserData = res.data;
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
  logout() {
    this.mentorService.logoutStatus(this.id).subscribe((res: any) => {
      console.log(res, "check responose");

      if (res.status === "Success" && res.messageID === 200) {
        console.log("check enter");

        this.oneUserData = res.data;
      }

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
      };
      setTimeout((t: any) => {
        localStorage.removeItem("token");
        this.router.navigate([""]);
        this.webSocket.disconnect();
      }, 1000);
    });
  }

  lastNotification: any = null;

  realTimeNotification() {
    this.webSocket.receivedNotificationInfo().subscribe((res: any) => {
      if (res.sender != this.id) {
        if (!this.lastNotification || this.lastNotification !== res) {
          console.log("New notification IN HEDER ========>:",res);
          this.toastr.success(res.message, "notification", { timeOut: 1000 });
          this.lastNotification = res;
        }
      }
    });
  }
  



  getNotifications() {
    this.allNotifications = [];
    this.menteeService.getNotification().subscribe((res: any) => {
      console.log(res, "result");

      if (res.messageID == "responses.SUCCESS_CODE") {
        this.allNotifications = res.data.notificationData.docs;
        this.notificationsCount = this.allNotifications.length;
        console.log(this.allNotifications, "notification result");
      }
    });
  }
  getNotificationForReciver() {
    this.allNotifications = [];
    this.menteeService.getNotificationForReciver().subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.mynotification = res.data;
        console.log(this.mynotification, " this.mynotification");
        this.count = res.count;

        this.toastr.success(res.message, res.status);
      }
    });
  }
  clearAllNotifications() {
    this.myarray = []
    this.allNotifications.map((e1: any) => {
      let id = e1._id
      this.myarray.push(id)
    })
    this.menteeService.clearAllNotifications(this.myarray).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.getNotifications()

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

  updateNotification(id: any) {
    let body = {
      id: id,
    };

    this.menteeService.updateNotification(body).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.getNotifications()

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

  clearNotification(notificationId: string) {
    let element = document.getElementsByClassName(
      "notification-" + notificationId
    )[0];
    if (element) {
      element.remove();
    }
    this.markNotificationClicked(notificationId);
    
  }

  markNotificationClicked(notificationId: string) {
    const data = { _id: notificationId };
    this.menteeService.markNotificationClicked(data).subscribe((res: any) => {
      if (res.messageID == 200) {
        this.notificationsCount = this.notificationsCount - 1;
      } else {
        console.log(res.message);
      }
    });
  }
}
