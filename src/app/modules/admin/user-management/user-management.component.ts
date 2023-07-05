import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  tab: any = "tab1";
  tab1: any;
  tab2: any;

  usereditForm: FormGroup;
  UserData: any;
  loginError: any;
  errortext: any;
  usersPage: any = 1;
  totaldocs: any;
  oneUserData: any = {};
  userID: any;
  roles: string = "";
  submitted: boolean = false;
  deleteId: any;
  imgsrc: any;
  imagefiles: any;
  preview: any;
  verificationIdFiles: any;
  showImage: any = environment.urlBackend;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService) {
    this.usereditForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl(''),

    });
  }
  // get f() { return this.usereditForm.controls; }
  openDiv(tabValue: any) {
    if (tabValue == "tab1") {
      this.tab = "tab1";
    } else if (tabValue == "tab2") {
      this.tab = "tab2";

    }
  }
  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.usersPage,
      roles: ""
    };
    this.getallUsers(data);
  }

  getallUsers(data: any) {
    this.adminService.manageUser(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.UserData = res.data.docs;
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
    })

  }
  getId(id: any) {
    this.userID = id
    this.adminService.getUser(this.userID).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.oneUserData = res.data;
        console.log(this.oneUserData, "       this.oneUserData");
        
        this.preview = this.oneUserData.validationid ? this.showImage + this.oneUserData.validationid : ''

        this.usereditForm.patchValue({
          firstName: this.oneUserData.firstName,
          lastName: this.oneUserData.lastName,
          email: this.oneUserData.email,
          phone: this.oneUserData.phone

        });

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
    let status = event.target.checked;

    if (status == true) {
      status = 1
    } else {
      status = 2
    }
    let data = {
      _id: catID,
      status: status
    }

    this.adminService.statusChangeUser(data).subscribe((res: any) => {

      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
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
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.usersPage,
      roles: this.roles,
      orderBy: [],
    };

    this.getallUsers(data);
  }
  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
      // roles: this.roles,
    };
    this.usersPage = page;
    this.getallUsers(data);
  }

  statusData: Boolean = this.oneUserData.verified_badge

  changePathStatus(event: any) {
    let status = event.target.checked;
    if (status == true) {
      this.statusData = true // Active
    } else {
      this.statusData = false //disable 
    }
  }

  updateUser() {

    this.submitted = true
    if (!this.usereditForm.valid) {
      return
    }
    let updateJson: any = {
      _id: this.userID,
      firstName: this.usereditForm.get("firstName")?.value,
      lastName: this.usereditForm.get("lastName")?.value,
      email: this.usereditForm.get('email')?.value,
      phone: this.usereditForm.get("phone")?.value,
      verified_badge: this.statusData
    }

    this.adminService.updateUserByAdmin(updateJson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let element: HTMLElement = document.getElementById("closeaddModal") as HTMLElement;
        element.click();
        let data = {
          filter: "",
          page: this.usersPage,
          roles: this.roles,
        };
        this.getallUsers(data);
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
  closemodal() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/admin-user-management"]);
    });
  }
  sortRoles(event: any) {
    this.roles = event.target.value;
    let data = {
      filter: "",
      roles: this.roles,
      page: this.usersPage,
    };
    this.getallUsers(data);
  }
  getidForDelete(id: any) {
    this.deleteId = id
  }
  deleteUser() {
    // let deleteID: any = {
    //   _id: this.userID
    // }
    this.adminService.deleteUser(this.deleteId).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let element: HTMLElement = document.getElementById("closemodaldelete") as HTMLElement;
        element.click();
        let data = {
          filter: "",
          roles: this.roles,
          page: this.usersPage,
        };
        this.getallUsers(data);
        // this.categoryName.patchValue({ categoryName: "" });
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


  handleimage(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {


      if (type === 'image') {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imgsrc = event.target.result;
        }
        this.imagefiles = event.target.files[0];
      } else if (type === 'skills') {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.preview = event.target.result;
        }
        this.verificationIdFiles = event.target.files[0];

      }

    }
  }






}
