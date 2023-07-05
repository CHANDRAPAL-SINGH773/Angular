import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-templates",
  templateUrl: "./templates.component.html",
  styleUrls: ["./templates.component.scss"],
})
export class TemplatesComponent implements OnInit {
  loginError: any;
  errortext: any;
  staticPageData: any;
  editorContent: string = "";
  staticPageEditForm: FormGroup;
  _id: any;
  OneStaticData: any;
  submitted: boolean = false;
  types: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService
  ) {
    this.staticPageEditForm = new FormGroup({
      heading: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      text: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.getAllStaticList();
  }

  getAllStaticList() {
    this.adminService.getAllStaticPages().subscribe(
      (res: any) => {
        console.log(res, "res");
        if (res.status === "Success" && res.messageID === 200) {
          this.staticPageData = res.data;
          console.log(this.staticPageData);

          this.types = this.staticPageData.map((item: any) => item.type);
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

  getStaticPageDataById(_id: any) {
    this._id = _id;
    this.adminService.getStaticPageById(this._id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          // this.toastr.success(res.message, res.status);
          this.OneStaticData = res.data;
          console.log(this.OneStaticData, "this.OneStaticData");

          this.staticPageEditForm.patchValue({
            heading: this.OneStaticData.heading,
            type: this.OneStaticData.type,
            text: this.OneStaticData.text,
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
          this.toastr.error(res.message, res.status);
        }
      }
    );
  }

  updateStaticPage() {
    this.submitted = true;
    if (!this.staticPageEditForm.valid) {
      return;
    }
    let updateJson: any = {
      _id: this._id,
      heading: this.staticPageEditForm.get("heading")?.value,
      type: this.staticPageEditForm.get("type")?.value,
      text: this.staticPageEditForm.get("text")?.value,
    };

    this.adminService.updateStaticPages(updateJson).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.getAllStaticList();
          this.toastr.success(res.message, res.status);
          let element: HTMLElement = document.getElementById(
            "closeaddModal"
          ) as HTMLElement;
          element.click();
        }
        // window.reload();
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
  openPreviewModal() {
    const previewModal = document.getElementById("preview-modal");
    if (previewModal != null) {
      previewModal.style.display = "block";
    }
  }

  closePreviewModal() {
    const previewModal = document.getElementById("preview-modal");
    if (previewModal != null) {
      previewModal.style.display = "none";
    }
  }
}
