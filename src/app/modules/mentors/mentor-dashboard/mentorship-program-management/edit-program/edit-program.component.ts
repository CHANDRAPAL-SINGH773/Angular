import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";

import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from 'src/app/Shared/token';
import { DatePipe } from '@angular/common';
import { noWhitespaceValidator } from 'src/app/Shared/event-utils';
@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent extends AuthorizationToken implements OnInit {
  editprogramForm: FormGroup;
  loginError: any;
  errortext: any;
  categoryData: any;
  submitted: boolean = false;
  user_id: any;
  showImage: any = environment.urlBackend;
  imgsrc: any = "../../../../../assets/images/uploadProfile.png";
  imagefiles: any = [];
  verificationIdFiles: any;
  filesview: any;
  // showLocation!: boolean;
  id: any;
  oneProgramDetail: any;
  showheading: any;

  documentName: any;
  documentType: any;
  miniMentee: number = 1;
  minimumPrice: number = 1;
  minDate: any;
  minimumExpiryDate: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private datePipe: DatePipe,
    private adminService: AdminService) {
    super()
    this.user_id = this.getLocalStorageID();

    this.editprogramForm = new FormGroup({
      mentorship_name: new FormControl('', [Validators.required,Validators.maxLength(40),noWhitespaceValidator()]),
      category_id: new FormControl('', Validators.required),
      mentorship_mode: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(1)]),
      mentee_limit: new FormControl('', [Validators.required, Validators.min(1)]),
      start_date: new FormControl('', Validators.required),
      availibility_from: new FormControl(''),
      availibility_to: new FormControl(''),
      expiry_date: new FormControl(''),
      // duration: new FormControl('', Validators.required),
      //payment_mode: new FormControl('', Validators.required),
      location: new FormControl('',[Validators.required,noWhitespaceValidator()]),
      description: new FormControl('',[Validators.required,Validators.maxLength(400),noWhitespaceValidator()]),
      image: new FormControl(''),
      skills: new FormControl(''),

    });
  }

  ngOnInit(): void {
    this.getAllCategoryDropdown()

    this.route.queryParams.subscribe((val: any) => {
      this.id = val._id;
      this.showheading = val.category

    })
    this.getProgram()
  }

  getProgram() {
    this.mentorservice.getOneProgram(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {

        this.oneProgramDetail = res.data;
        this.patchvalues();
        //this.imgsrc = `${this.oneProgramDetail.image}` ? `${environment.urlBackend}${this.oneProgramDetail.image}` : "../../assets/images/uploadProfile.png";
        this.imgsrc = this.oneProgramDetail.image ? this.showImage + this.oneProgramDetail.image : '../../../../../assets/images/uploadProfile.png'
        this.verificationIdFiles = this.oneProgramDetail.skills ? this.showImage + this.oneProgramDetail.skills : ''
        this.minDate = this.oneProgramDetail.start_date

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
  editProgram() {
    this.submitted = true
    if (!this.editprogramForm.valid) {
      return
    }
    var formData: any = new FormData();
    // formData.append("image", this.files);
    formData.append("mentorship_name", this.editprogramForm.get('mentorship_name')?.value);
    formData.append("category_id", this.editprogramForm.get('category_id')?.value);
    formData.append("mentorship_mode", this.editprogramForm.get('mentorship_mode')?.value);
    formData.append("experience", this.editprogramForm.get('experience')?.value);
    formData.append("price", this.editprogramForm.get('price')?.value);
    formData.append("mentee_limit", this.editprogramForm.get('mentee_limit')?.value);
    formData.append("start_date", this.editprogramForm.get('start_date')?.value);
    formData.append("availibility_from", this.editprogramForm.get('availibility_from')?.value);
    formData.append("availibility_to", this.editprogramForm.get('availibility_to')?.value);
    formData.append("expiry_date", this.editprogramForm.get('expiry_date')?.value);
    formData.append("description", this.editprogramForm.get('description')?.value);
    // formData.append("duration", this.editprogramForm.get('duration')?.value);
    formData.append("location", this.editprogramForm.get('location')?.value);
    //formData.append("payment_mode", this.editprogramForm.get('payment_mode')?.value);
    // formData.append("user_id", this.user_id);
    formData.append("_id", this.id);

    formData.append("image", this.imagefiles);
    formData.append("skills", this.filesview);

    this.mentorservice.editProgram(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        this.getProgram();
        this.router.navigate(['/mentor/mentor-dashboard/session-detail'],
          { queryParams: { _id: this.id, category: this.showheading }, })
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
      }
      else if (type === 'skills') {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          // this.imgsrc = event.target.result;
          this.verificationIdFiles = event.target.result;
        }
        this.filesview = event.target.files[0];

      }
    }
  }

  getAllCategoryDropdown() {
    this.adminService.getAllCategoryDropdown().subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.categoryData = res.data;
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
  // showlocation(event: any) {
  //   if (event.target.value == 1) {
  //     this.showLocation = false
  //   } else {
  //     this.showLocation = true
  //   }
  // }

  patchvalues() {
    this.editprogramForm.patchValue({
      mentorship_name: this.oneProgramDetail.mentorship_name,
      category_id: this.oneProgramDetail.category_id,
      mentorship_mode: this.oneProgramDetail.mentorship_mode,
      experience: this.oneProgramDetail.experience,
      price: this.oneProgramDetail.price,
      mentee_limit: this.oneProgramDetail.mentee_limit,
      start_date:this.datePipe.transform(this.oneProgramDetail.start_date,'yyyy-MM-dd'),
      address: this.oneProgramDetail.availibility,
      expiry_date:this.datePipe.transform(this.oneProgramDetail.expiry_date,'yyyy-MM-dd'),
      description: this.oneProgramDetail.description,
      location: this.oneProgramDetail.location,
      availibility_from: this.oneProgramDetail.availibility_from,
      availibility_to: this.oneProgramDetail.availibility_to,
    });
  }
  changeDate(event: any) {
    this.minimumExpiryDate = event.target.value

  }

}
