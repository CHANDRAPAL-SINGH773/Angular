import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AnyARecord } from "dns";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/Services/admin/admin.service";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-category-path",
  templateUrl: "./category-path.component.html",
  styleUrls: ["./category-path.component.css"],
})
export class CategoryPathComponent implements OnInit {
  totaldocs: any;
  loginError: any;
  errortext: any;
  token: any = "";
  headers: any;
  data: any = {};
  mentorshipData: any = [];
  categorypath_page: any = 1;
  name: any;
  singlementorshipData: any = {};
  catPathID: any;
  catPathName: any;
  catPathForm: FormGroup;
  mentorName: any;
  categoryData: any;
  showLocation: boolean = false;
  imgsrc: any;
  imagefiles: any;
  verificationIdFiles: any = [];
  id: any;
  showImage: any = environment.urlBackend;
  submitted: boolean = false;
  miniMentee: number = 1;
  minimumPrice: number = 1;
  minDate: any;
  minimumExpiryDate: any;
  preview: any;
  categoryName: any;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService
  ) {
    this.catPathForm = new FormGroup({
      mentorship_name: new FormControl("", Validators.required),
      description: new FormControl(""),
      mentorship_mode: new FormControl("", Validators.required),
      start_date: new FormControl("", Validators.required),
      availibility_from: new FormControl(""),
      availibility_to: new FormControl(""),
      price: new FormControl("", [Validators.required, Validators.min(1)]),
      experience: new FormControl("", Validators.required),
      mentee_limit: new FormControl("", [
        Validators.required,
        Validators.min(1),
      ]),
      expiry_date: new FormControl("", Validators.required),
      category_id: new FormControl("", Validators.required),
      location: new FormControl(""),
      image: new FormControl(""),
      skills: new FormControl(""),
      verify_badge: new FormControl(""),
    });
  }
  Search = "";

  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.categorypath_page,
    };

    // Retrieve the stored value from localStorage on page load
    const storedStatusData = localStorage.getItem("statusData");
    if (storedStatusData) {
      this.statusData = JSON.parse(storedStatusData);
    }

    this.getMentorshipPath(data);
    this.getAllCategoryDropdown();
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.categorypath_page,
       orderBy: [],
    };

    this.getMentorshipPath(data);
  }

  getMentorshipPath(data: any) {
    this.adminService.manageCategory(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.mentorshipData = res.data.docs;
          this.totaldocs = res.data.totalDocs;
          
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

  getId(id: any) {
    this.catPathID = id;
    this.adminService.getSingleProgram(this.catPathID).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.singlementorshipData = res.data;
          this.imgsrc = this.showImage + this.singlementorshipData.image;
          this.preview = this.singlementorshipData.skills
            ? this.showImage + this.singlementorshipData.skills
            : "";
          this.minDate = this.singlementorshipData.start_date;

          this.catPathForm.patchValue({
            description: this.singlementorshipData.description,
            price: this.singlementorshipData.price,
            mentorship_name: this.singlementorshipData.mentorship_name,
            availibility_from: this.singlementorshipData.availibility_from,
            availibility_to: this.singlementorshipData.availibility_to,
            experience: this.singlementorshipData.experience,
            expiry_date: this.datePipe.transform(
              this.singlementorshipData.expiry_date,
              "yyyy-MM-dd"
            ),
            mentee_limit: this.singlementorshipData.mentee_limit,
            mentorship_mode: this.singlementorshipData.mentorship_mode,
            start_date: this.datePipe.transform(
              this.singlementorshipData.start_date,
              "yyyy-MM-dd"
            ),
            category_id: this.singlementorshipData.category_id,
            location: this.singlementorshipData.location,
            verify_badge: this.singlementorshipData.verify_badge,
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

  closemodal() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/admin-category-path"]);
    });
  }
  statusData: Boolean = this.singlementorshipData.verified_badge;

  // changeVerifyBadgeStatus(event: any) {
  //   let status = event.target.checked;
  //   if (status == true) {
  //     this.statusData = true // Active
  //   } else {
  //     this.statusData = false //disable
  //   }
  // }

  changeVerifyBadgeStatus(event: any) {
    let status = event.target.checked;
    this.statusData = status;
    localStorage.setItem("statusData", JSON.stringify(status));
  }

  editpath() {
    this.submitted = true;
    if (!this.catPathForm.valid) {
      return;
    }
    var formData: any = new FormData();
    formData.append(
      "mentorship_name",
      this.catPathForm.get("mentorship_name")?.value
    );
    formData.append("category_id", this.catPathForm.get("category_id")?.value);
    formData.append(
      "mentorship_mode",
      this.catPathForm.get("mentorship_mode")?.value
    );
    formData.append("experience", this.catPathForm.get("experience")?.value);
    formData.append("price", this.catPathForm.get("price")?.value);
    formData.append(
      "mentee_limit",
      this.catPathForm.get("mentee_limit")?.value
    );
    formData.append("start_date", this.catPathForm.get("start_date")?.value);
    formData.append(
      "availibility_from",
      this.catPathForm.get("availibility_from")?.value
    );
    formData.append(
      "availibility_to",
      this.catPathForm.get("availibility_to")?.value
    );
    formData.append("expiry_date", this.catPathForm.get("expiry_date")?.value);
    formData.append("description", this.catPathForm.get("description")?.value);
    formData.append("location", this.catPathForm.get("location")?.value);
    formData.append("_id", this.catPathID);

    formData.append("image", this.imagefiles);
    formData.append("skills", this.verificationIdFiles);
    formData.append("verify_badge", this.statusData);

    this.adminService.updatePath(formData).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          let element: HTMLElement = document.getElementById(
            "closeaddModal"
          ) as HTMLElement;
          element.click();
          let data = {
            filter: "",
            page: this.categorypath_page,
          };
          this.getMentorshipPath(data);
          //  this.categoryName.patchValue({ categoryName: "" });
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
  deletecategoryPath() {
    let deleteID: any = {
      _id: this.catPathID,
    };
    this.adminService.deleteCategoryPath(deleteID).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          let element: HTMLElement = document.getElementById(
            "closeaddModal"
          ) as HTMLElement;
          element.click();
          //  this.categoryName.patchValue({ categoryName: "" });
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

  changePathStatus(event: any, catpathID: any) {
    let status = event.target.checked;
    if (status == true) {
      status = 1; // Active
    } else  {
      status = 2; //disable
    }
    let data = {
      _id: catpathID,
      status: status,
    };
    console.log(data,"datadatadata");
    
    this.adminService.statusCatPath(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
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

  sortRoles(event: any) {
    this.categoryName = event.target.value;
    let data = {
      filter: this.categoryName,
      page: this.categorypath_page,
    };
    this.getMentorshipPath(data);
  }

  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
    };
    this.categorypath_page= page;
    this.getMentorshipPath(data);
  }

  getAllCategoryDropdown() {
    this.adminService.getAllCategoryDropdown().subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
       
        this.categoryData = res.data;
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
  showlocation(event: any) {
    if (event.target.value == 1) {
      this.showLocation = false;
    } else {
      this.showLocation = true;
    }
  }
  handleimage(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      if (type === "image") {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imgsrc = event.target.result;
        };
        this.imagefiles = event.target.files[0];
      } else if (type === "skills") {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.preview = event.target.result;
        };
        this.verificationIdFiles = event.target.files[0];
      }
    }
  }
  changeDate(event: any) {
    this.minimumExpiryDate = event.target.value;
  }
}
