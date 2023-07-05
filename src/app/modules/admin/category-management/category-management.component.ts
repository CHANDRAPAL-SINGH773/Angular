import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from "src/app/Services/admin/admin.service";
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  loginError: any;
  errortext: any;
  categoryStatus!: boolean;
  category_page: any = 1;
  totaldocs: any;
  categoryData: any = [];
  categoryName: any;
  categoryID: any;
  createCategory: FormGroup;
  imagefiles: any = [];
  image: any;
  editCategory: FormGroup;
  imgsrc: any = '';
  imagecategory: any = environment.urlBackend;
  status: string = "";
  submitted: boolean = false;
  imageurl: any;
  // headers: HttpHeaders;
  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService,
    private adminService: AdminService) {
    this.createCategory = new FormGroup({
      image: new FormControl(''),
      categoryName: new FormControl('', Validators.required)
    });
    this.editCategory = new FormGroup({
      image: new FormControl(''),
      categoryName: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    // this.imgsrc = "./assets/images/profile-img.jpg"
    let data = {
      filter: "",
      status: this.status,
      page: this.category_page,
    };
    this.getCategory(data)
  }

  // getimage(image: any) {
  //   return this.imgsrc = `${this.image}` ? `${environment.urlBackend}${this.image}` : "../../assets/images/profile-img.jpg";
  // }
  getCategory(data: any) {
    this.adminService.getAllCategory(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {

        this.categoryData = res.data.docs;


        
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
  closemodal() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/admin-category-management"]);
    });
  }
  getId(id: any, name: any) {
    this.categoryName = name;
    this.categoryID = id;
    this.editCategory.patchValue({
      categoryName: this.categoryName
    })
  }

  createnewCategory() {
    this.submitted = true
    if (!this.createCategory.valid) {
      return
    }
    var formData: any = new FormData();
    formData.append("categoryName", this.createCategory.get('categoryName')?.value);
    formData.append("image", this.imagefiles);

    this.adminService.addCategory(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        let element: HTMLElement = document.getElementById("closeaddModal") as HTMLElement;
        element.click();
        let data = {
          filter: "",
          status: this.status,
          page: this.category_page,
        };
        this.getCategory(data);
        // this.commentForm.patchValue({ comments: "" });

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
  updateCategory() {
    this.submitted = true
    if (!this.editCategory.valid) {

      return
    }
    var formData: any = new FormData();
    formData.append("categoryName", this.editCategory.get('categoryName')?.value),
      formData.append("image", this.imagefiles),
      formData.append('_id', this.categoryID)

    this.adminService.updateCategory(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let element: HTMLElement = document.getElementById("closemodaledit") as HTMLElement;
        element.click();
        let data = {
          filter: "",
          status: this.status,
          page: this.category_page,
        };
        this.getCategory(data);
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
  deletecategory() {
    let deleteID: any = {
      _id: this.categoryID
    }
    this.adminService.deleteCategory(deleteID).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let element: HTMLElement = document.getElementById("closemodaldelete") as HTMLElement;
        element.click();
        let data = {
          filter: "",
          status: this.status,
          page: this.category_page,
        };
        this.getCategory(data);
        this.categoryName.patchValue({ categoryName: "" });
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
  changeStatus(event: any, catID: any) {
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

    this.adminService.statusChangeCategory(data).subscribe((res: any) => {

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
      page: this.category_page,

    };

    this.getCategory(data);



  }
  pageChange(page: any) {

    let data = {
      filter: "",
      status: this.status,
      page: page,
    };

    this.adminService.manageCategory(data).subscribe((res) => {


    });
  }
  handleimage(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imgsrc = event.target.result;
      }

      if (type === 'image') {
        this.imagefiles = event.target.files[0];
      }

    }

  }
  selectOption(event: any) {
    this.status = event.target.value;
    let data = {
      filter: "",
      status: this.status,
      page: this.category_page,
    };
    this.getCategory(data);

  }

}
