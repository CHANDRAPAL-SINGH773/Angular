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
import { AuthorizationToken } from "src/app/Shared/token";
import { AuthService } from 'src/app/Services/auth/auth.service';
import { countryCodes, noWhitespaceValidator, onlyAlphaNumericAllowed, onlyLettersAllowed, onlyLettersAndSpaceAllowed, onlyNumbersAllowed } from 'src/app/Shared/event-utils';
import { languages } from 'src/app/Shared/event-utils';

@Component({
  selector: 'app-mentee-profile',
  templateUrl: './mentee-profile.component.html',
  styleUrls: ['./mentee-profile.component.scss']
})
export class MenteeProfileComponent extends AuthorizationToken implements OnInit {
  menteeprofileForm: FormGroup;
  loginError: any;
  errortext: any;
  oneUserData: any;
  id: any;
  countryCodes: any;
  languages:any;
  submitted: boolean = false;
  responce: any;
  // token: any;
  headers: any;
  showImage: any = environment.urlBackend;
  imgsrc: any;
  files: any;
  image: any;
  verificationId: any;
  uploadFile: any;
  mediaArr: any = [];
  multipleFiles: any = [];
  gotage: any;
  arr: any = [];
  imagefiles: any;
  verificationIdFiles: any;
  skillsFiles: any = [];
  url: any;
  filesview: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private authService: AuthService,
    private adminService: AdminService) {
      super();
      this.id = this.getLocalStorageID();
      this.menteeprofileForm = new FormGroup({
        firstName: new FormControl('', [Validators.required,Validators.maxLength(20),noWhitespaceValidator()]),
        lastName: new FormControl('', [Validators.required,Validators.maxLength(20),noWhitespaceValidator()]),
        phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        gender: new FormControl(''),
        // age:new FormControl(''),
        date_of_birth: new FormControl(''),
        language: new FormControl(''),
        city: new FormControl(''),
        address: new FormControl(''),
        province: new FormControl(''),
        postalcode: new FormControl(''),
        country: new FormControl(''),
        bio: new FormControl(''),
        image: new FormControl(''),
        verificationId: new FormControl(''),
        // verificationId: new FormControl(''),
        // skillName: new FormArray([new FormControl("", [])], []),
        // skills: this.fb.array([]),
      });
     }

  ngOnInit(): void {
    this.countryCodes = countryCodes;
    this.languages=languages;
    this.getoneUser();
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

      } else if (type === 'verificationId') {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.verificationIdFiles = event.target.result;
        }

        this.filesview = event.target.files[0];


      }

    }

   
  }

   /*---------@Handler funcvtion to enforce constraint on textfields----------*/
   onlyNumbers(event:any) {
    onlyNumbersAllowed(event)
  }
  onlyLetters(event: any) {
    onlyLettersAllowed(event);
  }
  onlyLettersAndSpace(event: any) {
    onlyLettersAndSpaceAllowed(event);
  }
  onlyAlphaNumeric(event:any) {
    onlyAlphaNumericAllowed(event)
  }

  save() {
    this.submitted = true
    if (!this.menteeprofileForm.valid) {
      this.toastr.error("Error")
      return
    }

    var formData: any = new FormData();
    formData.append("firstName", this.menteeprofileForm.get('firstName')?.value);
    formData.append("lastName", this.menteeprofileForm.get('lastName')?.value);
    formData.append("phone", this.menteeprofileForm.get('phone')?.value);
    formData.append("gender", this.menteeprofileForm.get('gender')?.value);
    formData.append("date_of_birth", this.menteeprofileForm.get('date_of_birth')?.value);
    formData.append("language", this.menteeprofileForm.get('language')?.value);
    formData.append("city", this.menteeprofileForm.get('city')?.value);
    formData.append("address", this.menteeprofileForm.get('address')?.value);
    formData.append("province", this.menteeprofileForm.get('province')?.value);
    formData.append("postalcode", this.menteeprofileForm.get('postalcode')?.value);
    formData.append("country", this.menteeprofileForm.get('country')?.value);
    formData.append("bio", this.menteeprofileForm.get('bio')?.value);
    formData.append("_id", this.id);
    formData.append("validationid", this.filesview);
    formData.append("image", this.imagefiles);
    // formData.append("validationid", this.filesview);


    this.adminService.updateUserByAdmin(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.authService.setTokenAndUserInfo(res.data);

        this.toastr.success(res.message, res.status);
        // this.getoneUser();
        window.location.href="/mentee/mentee-dashboard/mentee-profile"
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
  getoneUser() {

    this.adminService.getUser(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.oneUserData = res.data;
        this.imgsrc = res.data.image ? this.showImage + res.data.image : '../../../../../assets/images/uploadProfile.png';
        this.verificationIdFiles = (res.data.validationid) ? this.showImage + res.data.validationid : '';
        this.patchvalues()
      }
    }, (err: any) => {
      let res = err?.error;
      if (res?.status === "Failed" && res?.messageID === 409) {
        this.toastr.error(res?.message, res?.status);
      } else if (res?.status === "Failed" && res?.messageID === 400) {
        this.toastr.error(res?.message[0].msg, res?.status);
      }

      else if (res?.status === "Failed" && res?.messageID === 404) {
        this.toastr.error(res?.message, res?.status);

      } else {
        this.loginError = true;
        this.errortext = res?.message;
        this.toastr.error(res?.message, res?.status);
      }
    })
  }

  patchvalues() {
 
    this.menteeprofileForm.patchValue({
      firstName: this.oneUserData.firstName,
      lastName: this.oneUserData.lastName,
      phone: this.oneUserData.phone,
      gender: this.oneUserData.gender,
      date_of_birth: this.oneUserData.date_of_birth,
      language: this.oneUserData.language,
      city: this.oneUserData.city,
      address: this.oneUserData.address,
      province: this.oneUserData.province,
      postalcode: this.oneUserData.postalcode,
      country: this.oneUserData.country,
      bio: this.oneUserData.bio,
    });
  }
}
