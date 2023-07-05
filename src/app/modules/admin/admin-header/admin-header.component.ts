import { Component, OnInit } from "@angular/core";
import { ToggleMenuService } from "src/app/Services/toggle-menu.service";
import { Router } from "@angular/router";
import { AuthorizationToken } from "src/app/Shared/token";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-admin-header",
  templateUrl: "./admin-header.component.html",
  styleUrls: ["./admin-header.component.scss"],
})
export class AdminHeaderComponent extends AuthorizationToken implements OnInit {
  clicked: boolean = true;
  name!: any;
  loginError: any;
  errortext: any;
  oneUserData: any;
  showImage: any = environment.urlBackend;
  id: any;
  constructor(private _toggle: ToggleMenuService,
    private router: Router,
    private toastr: ToastrService,
    private adminService: AdminService) {
    super();
    this.id = this.getLocalStorageID();
  }

  toggleSidebar() {
    this.clicked = !this.clicked;
    this._toggle.clicked.next(this.clicked);
  }

  ngOnInit(): void {
    this.getoneUser()
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
  logOut(){
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }
}
