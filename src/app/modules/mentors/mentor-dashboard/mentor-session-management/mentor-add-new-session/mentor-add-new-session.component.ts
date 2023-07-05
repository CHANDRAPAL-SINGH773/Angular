

import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';



import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { noWhitespaceValidator } from 'src/app/Shared/event-utils';
// declare var google: any

@Component({
  selector: 'app-mentor-add-new-session',
  templateUrl: './mentor-add-new-session.component.html',
  styleUrls: ['./mentor-add-new-session.component.scss']
})
export class MentorAddNewSessionComponent extends AuthorizationToken implements OnInit {
  submitted: boolean = false;
  addDayWise: FormGroup;
  loginError: any;
  errortext: any;
  files: any;
  image: any;
  daywiseID: any;
  status: string = "";
  user_id: any;
  showImage: any = environment.urlBackend;
  imgsrc: any = '';
  categoryData: any = [];
  category_page: any = 1;
  start_date: any;
  value: any
  gotPrograms: any = [];
  imagefiles: any;
  programid: any;
  programname: any;
  showHeading: any;
  flag: any = false;
  minDate = new Date().toISOString().split('T')[0];
  mode: any;
  onlineMode!: boolean;
  //for map
  lat: any = 55.05655;
  lng: any = -3.22321;




  latMarker: any;
  lngMarker: any;

  zoom = 7;

  @ViewChild('search')
  public searchElementRef!: ElementRef;

  //   latitude: number;
  // longitude: number;
  // zoom: number;
  address!: string;
  private geoCoder: any;
  formatted_address: string | undefined;

  constructor(
    private toastr: ToastrService,
    private mentorService: MentorServiceService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,

    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    super()
    this.user_id = this.getLocalStorageID();

    this.addDayWise = new FormGroup({
      image: new FormControl(''),
      sessionName: new FormControl('', [Validators.required,Validators.maxLength(50),noWhitespaceValidator()]),
      sessionLink: new FormControl('', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),noWhitespaceValidator()]),
      start_date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      program: new FormControl('', Validators.required),
      sessionDuration: new FormControl('', [Validators.required, Validators.min(0.1)]),
      location: new FormControl(''),
      description: new FormControl('', [Validators.required,noWhitespaceValidator()]),

    });
  }

  ngOnInit(): void {
    // this.searchloc();
    this.route.queryParams.subscribe((val: any) => {
      this.start_date = val.from;
      this.programid = val._id;
      this.mode = val.mode;
      this.showHeading = val.category
    })


    if (this.mode == 1) {
      this.onlineMode = true
      this.addDayWise.controls['sessionLink'].addValidators([Validators.required])


    } else if (this.mode == 0) {
      this.onlineMode = false
      this.addDayWise.controls['location'].addValidators([Validators.required])


    }



    this.flag = this.programid ? true : false;


    // this.getAllCategoryDropdown()
    this.getprogramDropdown()

    this.patchValues()
this.autoComplete()
    // load Places Autocomplete
  
  }
  autoComplete(){
  this.mapsAPILoader.load().then(() => {
    // this.setCurrentLocation();
    this.geoCoder = new google.maps.Geocoder;

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log(JSON.stringify(place))

        this.formatted_address = place.formatted_address
        //set latitude, longitude and zoom
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.zoom = 12;
      });
    });
  });
}
  patchValues() {
    
    this.addDayWise.patchValue({
      start_date: this.start_date,
      program: this.programid
    })
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


  submit() {
    this.submitted = true
    if (!this.addDayWise.valid) {
      return
    }


    var formData: any = new FormData();
    formData.append("session_name", this.addDayWise.get('sessionName')?.value);
    formData.append("session_link", this.addDayWise.get('sessionLink')?.value);
    formData.append("start_date", this.addDayWise.get('start_date')?.value);
    formData.append("time", this.addDayWise.get('time')?.value);
    formData.append("session_duration", this.addDayWise.get('sessionDuration')?.value);
    formData.append("location", this.formatted_address);
    formData.append("description", this.addDayWise.get('description')?.value);
    formData.append("program_id", this.addDayWise.get('program')?.value);
    formData.append("user_id", this.user_id);
    formData.append("image", this.imagefiles);


    if (!this.onlineMode) {
      formData.append("lat", this.lat);
      formData.append("lng", this.lng);
    }

    this.mentorService.addDayWise(formData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        if (this.programid) {
          this.router.navigate(['/mentor/mentor-dashboard/session-detail'], {
            queryParams: { _id: this.programid, category: this.showHeading },
          }
          )
        }
        else {
          this.router.navigate(['/mentor/mentor-dashboard/session-management'],)
        }

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
    console.log(event, "modeValue");
    for (const value of this.gotPrograms) {
      console.log(event, value._id, "value");

      if (value._id == event) {
        this.addDayWise.controls['sessionLink'].clearValidators();
        this.addDayWise.controls['sessionLink'].updateValueAndValidity();
        this.addDayWise.controls['location'].clearValidators();
        this.addDayWise.controls['location'].updateValueAndValidity();

        actualMode = value.mentorship_mode;

        if (actualMode === 1) {
          this.onlineMode = true
          this.addDayWise.controls['sessionLink'].addValidators([Validators.required])
        } else if (actualMode === 0) {
          this.onlineMode = false
          this.addDayWise.controls['location'].addValidators([Validators.required])
        }
        break;
      }
    }

  }

  goBack(): void {
    this.location.back();
  }

  addMarker(event: any) {
    console.log(`latitude: ${event.coords.lat}, longitude: ${event.coords.lng}`);
    this.latMarker = `${event.coords.lat}`;
    this.lngMarker = ` ${event.coords.lng}`;
    this.getAddress();
  }

  getAddress() {
    // let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.latMarker + ',' +
    //   this.lngMarker + '&key=AIzaSyAm-LurscF5upUllWpiWImD4stS4WrEFRE'
    // this.mentorService.getLocation(url).subscribe((res: any) => {
    //   console.log(res)
    // },
    //   error => {
    //     console.log(error)
    //   });
  }

  // searchloc() {
  //   const center = { lat: 50.064192, lng: -130.605469 };
  //   // Create a bounding box with sides ~10km away from the center point
  //   const defaultBounds = {
  //     north: center.lat + 0.1,
  //     south: center.lat - 0.1,
  //     east: center.lng + 0.1,
  //     west: center.lng - 0.1,
  //   };
  //   const input = document.getElementById("pac-input") as HTMLInputElement;
  //   const options = {
  //     bounds: defaultBounds,
  //     componentRestrictions: { country: "us" },
  //     fields: ["address_components", "geometry", "icon", "name"],
  //     strictBounds: false,
  //     types: ["establishment"],
  //   };

  //   const autocomplete = new google.maps.places.Autocomplete(input, options);
  // }

  selectedLoc(event: any) {
    console.log(event);
  }

}
