import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { MapsAPILoader } from '@agm/core';
import { Location } from '@angular/common';
import * as moment from "moment";
import { noWhitespaceValidator } from 'src/app/Shared/event-utils';
@Component({
  selector: 'app-mentor-edit-new-session',
  templateUrl: './mentor-edit-new-session.component.html',
  styleUrls: ['./mentor-edit-new-session.component.scss']
})
export class MentorEditNewSessionComponent extends AuthorizationToken implements OnInit {
  editDayWise: FormGroup;
  submitted: any;
  daywiseID: any;
  files: any;
  loginError: any;
  errortext: any;
  user_id: any;
  oneSessionDetail: any;
  imgsrc: any;
  id: any;
  imagefiles: any = [];
  imagecategory: any = environment.urlBackend;
  showData: any;
  gotPrograms: any;
  onlineMode: any = true;

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  address!: string;
  private geoCoder: any;
  lat: any = 55.05655;
  lng: any = -3.22321;
  zoom = 7;

  formatted_address:any;
  constructor(
    private toastr: ToastrService,
    private mentorService: MentorServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private location: Location,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone

  ) {
    super()
    this.user_id = this.getLocalStorageID();

    this.editDayWise = new FormGroup({
      image: new FormControl(''),
      sessionName: new FormControl('', [Validators.required,Validators.maxLength(50), noWhitespaceValidator()]),
      sessionLink: new FormControl('', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      start_date: new FormControl('', Validators.required),
      // end_date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      program_id: new FormControl('', Validators.required),
      // sessionDuration: new FormGroup({
      //   hours: new FormControl('',Validators.required),
      //   min: new FormControl('',Validators.required),
      // }),
      sessionDuration: new FormControl('', [Validators.required, Validators.min(0.1)]),
      location: new FormControl(''),
      description: new FormControl('', [Validators.required, noWhitespaceValidator()]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.id = val.edit;
      this.onlineMode = parseInt(val.onlineMode)===1?true:false;
      console.log(this.onlineMode ,"<<<<<<<<",val.onlineMode);
      
    })
    this.getOneDaywise();
    this.getprogramDropdown();
    this.mapLoads();
    // load Places Autocomplete
 
  }
  mapLoads(){
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef?.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log(JSON.stringify(place))

          this.formatted_address=  place.formatted_address
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  getprogramDropdown() {

    this.mentorService.getprogramDropdown(this.user_id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.gotPrograms = res.data;

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
  cancelSession() {
    this.mentorService.cancelSession(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.router.navigate(['/mentor/mentor-dashboard/session-management'])
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
  deleteSession() {

    this.mentorService.deleteSession(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.router.navigate(['/mentor/mentor-dashboard/session-management'])
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
  // closemodal() {
  //   this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
  //     this.router.navigate(["/mentor/mentor-dashboard/session-management"]);
  //   });
  // }

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

  getOneDaywise() {

    this.mentorService.getOneDaywise(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);

        this.oneSessionDetail = res.data;
        
        
        this.imgsrc = this.oneSessionDetail.image ? this.imagecategory + this.oneSessionDetail.image : '../../../../../assets/images/uploadProfile.png'
        // this.verificationIdFiles = this.oneSessionDetail.skills ? this.imagecategory + this.oneSessionDetail.skills : ''

        // this.imgsrc = `${this.oneSessionDetail.image}` ? `${environment.urlBackend}${this.oneSessionDetail.image}` : "../../assets/img/user.jpeg";

        this.patchvalues()

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

  patchvalues() {
    this.editDayWise.patchValue({
      sessionName: this.oneSessionDetail.session_name,
      sessionLink: this.oneSessionDetail.session_link,
      start_date: this.datePipe.transform(this.oneSessionDetail.start_date, 'yyyy-MM-dd'),


      // end_date: this.oneSessionDetail.end_date,
      program_id: this.oneSessionDetail.program_id._id,
      time: this.oneSessionDetail.time,
      sessionDuration: this.oneSessionDetail.session_duration,
      location: this.oneSessionDetail.location,
      description: this.oneSessionDetail.description
    });
  }
  submit() {
    this.submitted = true
    if (!this.editDayWise.valid) {
console.log("IIII");

      return
    }
    console.log("save");
    
    var formData: any = new FormData();
    formData.append("session_name", this.editDayWise.get('sessionName')?.value);
    formData.append("session_link", this.editDayWise.get('sessionLink')?.value);
    formData.append("start_date", this.editDayWise.get('start_date')?.value);
    // formData.append("start_date", moment.utc(this.editDayWise.get('start_date')?.value).unix());
    formData.append("time", this.editDayWise.get('time')?.value);
    formData.append("session_duration", this.editDayWise.get('sessionDuration')?.value);
    formData.append("location", this.formatted_address);
    formData.append("description", this.editDayWise.get('description')?.value);
    formData.append("program_id", this.editDayWise.get('program_id')?.value);
    formData.append("image", this.imagefiles),
      formData.append('_id', this.id)



    if (this.onlineMode===false) {
   console.log( this.lat,"check false", this.lng);
   

      formData.append("lat", this.lat);
      formData.append("lng", this.lng);
    }
    this.mentorService.updateDayWise(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.router.navigate(["/mentor/mentor-dashboard/session-management"]);
        // this.patchvalues()
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
  seeMode(event: any) {
    let actualMode
   
    for (const value of this.gotPrograms) {

      if (value._id == event) {
        this.editDayWise.controls['sessionLink'].clearValidators();
        this.editDayWise.controls['sessionLink'].updateValueAndValidity();
        this.editDayWise.controls['location'].clearValidators();
        this.editDayWise.controls['location'].updateValueAndValidity();
        actualMode = value.mentorship_mode;
        console.log(actualMode, "modeValue");
        if (actualMode === 1) {
          this.onlineMode = true
          this.editDayWise.controls['sessionLink'].addValidators([Validators.required])
        } else if (actualMode === 0) {
         
          this.onlineMode = false
          // this.mapLoads();
          this.editDayWise.controls['location'].addValidators([Validators.required])
          this.editDayWise.controls['location'].reset()
        }
        break;
      }
    }

  }


  showLoc(event:any){
    // alert(event.target.value);
  }

}
