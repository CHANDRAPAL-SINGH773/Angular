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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from "src/app/Shared/token";
import { AuthService } from 'src/app/Services/auth/auth.service';
import { countryCodes, noWhitespaceValidator, onlyAlphaNumericAllowed, onlyLettersAllowed, onlyLettersAndSpaceAllowed, onlyNumbersAllowed,} from 'src/app/Shared/event-utils';
import { languages } from 'src/app/Shared/event-utils';
@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.scss']
})
export class MentorProfileComponent extends AuthorizationToken implements OnInit {
  gotCategories: any = [];
  mentorprofileForm: FormGroup;
  loginError: any;
  errortext: any;
  oneUserData: any;
  id: any;
  countryCodes: any
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
  showPreview: any = [];
  viewSkill: any;
  languages: any;
  noCertificate: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private authService: AuthService,
    private adminService: AdminService) {

      
    super();
    
    this.id = this.getLocalStorageID();
    this.mentorprofileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20), noWhitespaceValidator()]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20), noWhitespaceValidator()]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}")]),
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
      // skillName: new FormArray([new FormControl("", [])], []),
      skills: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.countryCodes = countryCodes;
    this.languages = languages;
    this.getoneUser();
    this.getAllCategoryDropdown();
    this.addNewData();

  }
  /*---------@Handler function to enforce constraint on textfields----------*/
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
    if (!this.mentorprofileForm.valid) {
      this.toastr.error("Please enter the required fields")
      return
    }

    var formData: any = new FormData();
    formData.append("firstName", this.mentorprofileForm.get('firstName')?.value);
    formData.append("lastName", this.mentorprofileForm.get('lastName')?.value);
    formData.append("phone", this.mentorprofileForm.get('phone')?.value);
    formData.append("gender", this.mentorprofileForm.get('gender')?.value);
    // formData.append("age",this.gotage);
    formData.append("date_of_birth", this.mentorprofileForm.get('date_of_birth')?.value);
    formData.append("language", this.mentorprofileForm.get('language')?.value);
    formData.append("city", this.mentorprofileForm.get('city')?.value);
    formData.append("address", this.mentorprofileForm.get('address')?.value);
    formData.append("province", this.mentorprofileForm.get('province')?.value);
    formData.append("postalcode", this.mentorprofileForm.get('postalcode')?.value);
    formData.append("country", this.mentorprofileForm.get('country')?.value);
    formData.append("bio", this.mentorprofileForm.get('bio')?.value);
    formData.append("_id", this.id);
    formData.append("skillsdata", JSON.stringify(this.mentorprofileForm.get('skills')?.value));

    formData.append("image", this.imagefiles);
    formData.append("validationid", this.filesview);

    /*  for (var i = 0; i < this.skillsFiles.length; i++) {
       formData.append('skills', this.skillsFiles[i]);
     } */
    /*  console.log(this.skillsFiles[i], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  */
    this.adminService.updateUserByAdmin(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.authService.setTokenAndUserInfo(res.data);

        this.toastr.success(res.message, res.status);
        // this.getoneUser();
        window.location.href = "/mentor/mentor-dashboard/profile"
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
  getoneUser() {

    this.adminService.getUser(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.oneUserData = res.data;
        this.imgsrc = res.data.image ? this.showImage + res.data.image : '../../../../../assets/images/uploadProfile.png';
        this.verificationIdFiles = (res.data.validationid) ? this.showImage + res.data.validationid : '';
        //this.showPreview = (res.data.skills.certificates) ? this.showImage + res.data.vskills.certificates : '';
        console.log(res.data.skills, "testttttttttt");
        let skills = res?.data?.skills;
        if (skills && skills.length > 0) {
          skills.map((e1: any) => {
            this.showPreview.push(`${this.showImage}${e1.certificates}`)
          })
        }
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
    if (this.oneUserData.skills) {
      for (let i = 0; i < this.oneUserData.skills.length - 1; i++) {
        this.addNewData();

      }
    }



    this.mentorprofileForm.patchValue({
      firstName: this.oneUserData.firstName,
      lastName: this.oneUserData.lastName,
      phone: this.oneUserData.phone,
      //  age:this.gotage,
      gender: this.oneUserData.gender,
      date_of_birth: this.oneUserData.date_of_birth,
      language: this.oneUserData.language,
      city: this.oneUserData.city,
      address: this.oneUserData.address,
      province: this.oneUserData.province,
      postalcode: this.oneUserData.postalcode,
      country: this.oneUserData.country,
      bio: this.oneUserData.bio,
      skills: this.oneUserData.skills,
    });
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

    // if (event.target.files && event.target.files[0]) {
    //   if (type === 'image') {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(event.target.files[0]);
    //     reader.onload = (event: any) => {
    //       this.imgsrc = event.target.result;

    //     }
    //     this.imagefiles = event.target.files[0];
    //   }
    //   else if (type === 'verificationId') {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(event.target.files[0]);
    //     reader.onload = (event: any) => {
    //       // this.imgsrc = event.target.result;
    //       this.verificationIdFiles = event.target.files[0];
    //     }
    //     this.filesview = event.target.files[0];

    //   }
    // }
  }
  handleimages(event: any, type: any, index: any){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.showPreview[index] = event.target.result;
      }
      let formData = new FormData();
      formData.append("skills", event.target.files[0]);

      this.mentorservice.uploadSkillFiles(formData).subscribe((res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          let path = res.data;
          let skillsData = this.mentorprofileForm.value.skills;

          if (skillsData && skillsData.length > 0) {
            this.mentorprofileForm.value.skills[index].certificates = path

              this.showPreview[index] = `${this.showImage}${path}`;
        
          }
        }
      })
    }
  }
  get medicine() {
    return this.mentorprofileForm.controls["skills"] as FormArray;
  }
  addNewData() {
    const skillDetails = this.fb.group({
      skillName: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      certificates: ['']
    });
    this.medicine.push(skillDetails);
  }
  deleteMobile(index: number) {
    this.medicine.removeAt(index);
  }

  viewSkills(index: any) {
    this.viewSkill = this.showPreview[index];

    const urlParts = this.viewSkill.split('/'); // Split the URL by slashes
    if (urlParts.length > 3) {
      this.noCertificate = urlParts[3];
      // console.log("Value after third slash:", this.noCertificate);
    }
  }

}