import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "src/app/Services/admin/admin.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { AuthService } from "src/app/Services/auth/auth.service";
import { countryCodes } from "src/app/Shared/event-utils";
import { languages } from "src/app/Shared/event-utils";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent extends AuthorizationToken implements OnInit {
  ids: string = "account";
  id: any;
  oneUserData: any;
  showImage: any = environment.urlBackend;
  imgsrc: any;
  verificationIdFiles: any;
  showPreview: any = [];
  loginError: any;
  errortext: any;
  viewSkill:any;
  skills:any;
  role : any;
  gotCategories:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    super();
    this.id = this.getLocalStorageID();
    this.role = this.getLocalStorageRole();
  }

  changeTab(ids: string) {
    this.ids = ids;
  }
  ngOnInit(): void {
    this.getoneUser();
    this.getAllCategoryDropdown();
    this.role = this.role
  }

  getoneUser() {
    this.adminService.getUser(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.oneUserData = res.data;

          this.imgsrc = res.data.image
            ? this.showImage + res.data.image
            : "../../../../../assets/images/uploadProfile.png";

          this.verificationIdFiles = res.data.validationid
            ? this.showImage + res.data.validationid
            : "../../../assets/images/document.png";

          //this.showPreview = (res.data.skills.certificates) ? this.showImage + res.data.vskills.certificates : '';
          this.skills = res.data.skills;

          let skills = res?.data?.skills;
          if (skills && skills.length > 0) {
            skills.map((e1: any) => {
              this.showPreview.push(`${this.showImage}${e1.certificates}`);
            });
          }
          // this.patchvalues()
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

  getAllCategoryDropdown() {

    this.adminService.getAllCategoryDropdown().subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.gotCategories = res.data;
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
    })
  }

  logOut(){
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }
}
