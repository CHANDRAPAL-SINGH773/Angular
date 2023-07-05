import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';

@Component({
  selector: 'app-social-media-post',
  templateUrl: './social-media-post.component.html',
  styleUrls: ['./social-media-post.component.scss']
})
export class SocialMediaPostComponent implements OnInit {
  mediaPost_page: any = 1;
  status: string = "";
  socialMediaData: any;
  loginError: any;
  errortext: any;
  totaldocs: any;
  socialMediaApprovalForm: FormGroup;
  submitted: boolean = false;
  showLocation: boolean = false;
  mediaPostId: any;

  constructor(private adminService: AdminService,
    private toastr: ToastrService) {

    this.socialMediaApprovalForm = new FormGroup({
      media_postApproval: new FormControl('', [Validators.required]),

    });
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      status: this.status,
      page: this.mediaPost_page,
    };
    this.getAllMediaPost(data)
  }


  getAllMediaPost(data: any) {
    this.adminService.getAllMediaPost(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {

        this.socialMediaData = res.data.docs;
        this.totaldocs = res.data.totalDocs;
        console.log(this.socialMediaData, "scosidfosiu");






        // this.image = this.categoryData.image;
        // this.imgsrc = `${this.image}` ? `${environment.urlBackend}${this.image}` : "../../assets/images/profile-img.jpg";

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

  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
      // roles: this.roles,
    };
    this.mediaPost_page = page;
    this.getAllMediaPost(data);
  }


  showlocation(event: any) {
    if (event.target.value == 1) {
      this.showLocation = false
    } else {
      this.showLocation = true
    }
  }
  clickAction(id: any) {
    console.log(id, "check id pls");

    this.mediaPostId = id;
  }
  editpath() {
    this.submitted = true
    console.log(this.submitted, "check");

    if (!this.socialMediaApprovalForm.valid) {
      return
    }

    let myjson = {
      _id: this.mediaPostId,
      status: this.socialMediaApprovalForm.get("media_postApproval")?.value
    }
    console.log(myjson, "myscocicicici");

    this.adminService.updateMediaStatus(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let element: HTMLElement = document.getElementById("closeaddModal") as HTMLElement;
        element?.click();
        let data = {
          filter: "",
          page: this.mediaPost_page,
        };
        this.getAllMediaPost(data);
        //  this.categoryName.patchValue({ categoryName: "" });
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
  changeuserStatus(event: any, catID: any) {
    // let status = event.target.checked;

    // if (status == true) {
    //   status = 1
    // } else {
    //   status = 2
    // }
    // let data = {
    //   _id: catID,
    //   status: status
    // }

    // this.adminService.statusChangeUser(data).subscribe((res: any) => {

    //   if (res.status === "Success" && res.messageID === 200) {
    //     this.toastr.success(res.message, res.status);
    //   }
    // }, (err: any) => {
    //   let res = err.error
    //   if (res.status === "Failed" && res.messageID === 409) {
    //     this.toastr.error(res.message, res.status);
    //   } else if (res.status === "Failed" && res.messageID === 400) {
    //     this.toastr.error(res.message[0].msg, res.status);
    //   }

    //   else if (res.status === "Failed" && res.messageID === 404) {
    //     this.toastr.error(res.message, res.status);

    //   } else {
    //     this.loginError = true;
    //     this.errortext = res.message;
    //     this.toastr.error(res.message, res.status);
    //   }

    // });
  }
}