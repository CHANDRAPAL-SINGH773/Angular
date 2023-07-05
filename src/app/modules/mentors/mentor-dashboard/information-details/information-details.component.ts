import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import { StripeCardElementOptions, StripeElementsOptions } from "@stripe/stripe-js";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
import { countryStateCity } from 'src/app/Shared/event-utils';
@Component({
  selector: 'app-information-details',
  templateUrl: './information-details.component.html',
  styleUrls: ['./information-details.component.scss']
})
export class InformationDetailsComponent implements OnInit {
  infoDetailForm:FormGroup;
  submitted:boolean=false;
  cardForm:FormGroup;
  // countries: any[] = []; // list of countries
  filteredStates: any[] = []; // list of states filtered by selected country
  filteredCities: any[] = []; // list of cities filtered by selected state

  countries: any[] = [
    {
      "name": "United States",
      "code": "US",
      "states": [
        {
          "name": "New York",
          "code": "NY",
          "cities": [
            {
              "name": "New York City",
              "code": "NYC"
            },
            {
              "name": "Buffalo",
              "code": "BUF"
            }
          ]
        },
        {
          "name": "California",
          "code": "CA",
          "cities": [
            {
              "name": "Los Angeles",
              "code": "LA"
            },
            {
              "name": "San Francisco",
              "code": "SF"
            }
          ]
        }
      ]
    },
    {
      "name": "Canada",
      "code": "CA",
      "states": [
        {
          "name": "Ontario",
          "code": "ON",
          "cities": [
            {
              "name": "Toronto",
              "code": "TOR"
            },
            {
              "name": "Ottawa",
              "code": "OTT"
            }
          ]
        },
        {
          "name": "Quebec",
          "code": "QC",
          "cities": [
            {
              "name": "Montreal",
              "code": "MTL"
            },
            {
              "name": "Quebec City",
              "code": "QUE"
            }
          ]
        }
      ]
    }
  ];

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  customerId = '';

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        // borderWidth: '1px',

        // borderRadius: '0.375rem !important',
        padding: '0.5rem !important',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        },


      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  stripeTest: any = FormGroup;
  cardDetails: any;
  loginError: any;
  errortext: any;
  countryCodes: any;

  constructor(private stripeService: StripeService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorService: MentorServiceService,) {

      this.infoDetailForm = new FormGroup({
        confirmaccountNo: new FormControl('', Validators.required),
        accountnumber: new FormControl('', Validators.required),
        swiftCode:new FormControl('', Validators.required),
        businessProfileUrl:new FormControl('', Validators.required),
        country:new FormControl('', Validators.required),
        postalCode: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state:new FormControl('', Validators.required),
        SSN:new FormControl('', Validators.required),
        email:new FormControl('',[Validators.required, Validators.email]),
        dob:new FormControl('', Validators.required),
        address2: new FormControl('', Validators.required),
        address1: new FormControl('', Validators.required),
        phone:new FormControl('', [Validators.required ,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        lastName:new FormControl('', Validators.required),
        firstName:new FormControl('', Validators.required),

      })

      this.cardForm=new FormGroup({
        account_number: new FormControl('', Validators.required),
        routing_number: new FormControl('', Validators.required),
      })
     }
     onCountryChanged() {
      const countryCode  = this.infoDetailForm.get('country')?.value;
      const selectedCountry = this.countries.find((c:any) => c.code === countryCode);
      this.filteredStates = selectedCountry ? selectedCountry.states : [];
      this.filteredCities = [];
      this.infoDetailForm.get('state')?.reset();
      this.infoDetailForm.get('city')?.reset();
    }
  
    onStateChanged() {
      const stateCode = this.infoDetailForm.get('state')?.value;
      const selectedCountryCode = this.infoDetailForm.get('country')?.value;
      const selectedCountry = this.countries.find((c:any )=> c.code === selectedCountryCode);
      const selectedState = selectedCountry.states.find((s:any) => s.code === stateCode);
      this.filteredCities = selectedState ? selectedState.cities : [];
      this.infoDetailForm.get('city')?.reset();
    }
  
  ngOnInit(): void {
    this.countryCodes = countryStateCity;
  }

  save(){
   this.submitted = true
    if (!this.infoDetailForm.valid) {
      return
    }
    let myjson={
      accountnumber:this.infoDetailForm.get("accountnumber")?.value,
      swiftCode:this.infoDetailForm.get("swiftCode")?.value,
      businessProfileUrl:this.infoDetailForm.get("businessProfileUrl")?.value,
      country:this.infoDetailForm.get("country")?.value,
      postalCode:this.infoDetailForm.get("postalCode")?.value,
      city:this.infoDetailForm.get("city")?.value,
      state:this.infoDetailForm.get("state")?.value,
      SSN:this.infoDetailForm.get("SSN")?.value,
      email:this.infoDetailForm.get("email")?.value,
      dob:this.infoDetailForm.get("dob")?.value,
      address2:this.infoDetailForm.get("address2")?.value,
      phone:this.infoDetailForm.get("phone")?.value,
      lastName:this.infoDetailForm.get("lastName")?.value,
      firstName:this.infoDetailForm.get("firstName")?.value,
      

    }
    console.log(myjson,"myjson");
    
    this.mentorService.addProgram(myjson).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status);
        // this.router.navigate(['mentor/mentor-dashboard/mentorship']);
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



addCard(){
  this.submitted = true
  if (!this.infoDetailForm.valid) {
    return
  }
  let cardjson={
    account_number:this.infoDetailForm.get("account_number")?.value,
    routing_number:this.infoDetailForm.get("routing_number")?.value,

  }
  console.log(cardjson,"cardjson");
  
  this.mentorService.addProgram(cardjson).subscribe((res: any) => {
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
  })
}
}
