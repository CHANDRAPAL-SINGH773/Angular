import { Component, OnInit } from '@angular/core';
import {   FormBuilder,
  FormControl,
  FormGroup,
  Validators, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent extends AuthorizationToken implements OnInit {
  ratingData: any=[];
  errortext: any;
  loginError:any;
  rating_page: any = 1;
  programId: any;
  showImage: any = environment.urlBackend;
  ratingdate: any;
  ratingForm:FormGroup;
  id: any;
  programData: any={};
  avg: any;
  submitted:boolean=false;
  averageRating: any;
  disableRating:boolean=false;
  constructor(
    private location: Location,
    private menteeService: MenteeService,
    private mentorService:MentorServiceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,) { 
      super();
      this.id = this.getLocalStorageID();
      this.ratingForm= new FormGroup({
        rating: new FormControl('',Validators.required),
        comment:new FormControl(''),
      })
    }


  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.programId = val.program_id;

    });
    this.getOneDaywise()
    let data = {
      filter: "",
     program_id:this.programId ,
      page: this.rating_page,
    };
    this.getRating(data)
  }

  getRating(data: any) {
    this.menteeService.getRating(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        if(res.data){
        this.ratingData = res.data.docs
        this.ratingData.map((k1:any)=>{
          if(this.id === k1.mentee_id ){
            console.log(k1.mentee_id,"kkk")
            this.disableRating=true
            console.log(this.disableRating,"m,m")
          }
        })

        this.averageRating= this.ratingData[0].averageRating
        this.avg=res.avg
        console.log(this.avg,"ooooooooooooooooooo")
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
  ratingReview(){

    this.submitted = true
    if (!this.ratingForm.valid) {
      return
    }

    let rateData ={
      rating:this.ratingForm.get('rating')?.value,
      comment:this.ratingForm.get('comment')?.value,
      userId:this.id,
      program_id: this.programId 

    }

    console.log(this.ratingForm.get('rating')?.value,"<<<<<");
    this.menteeService.ratingReview(rateData).subscribe((res: any) => {
      console.log(res,"<<<<");
      
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        let data = {
          filter: "",
         program_id:this.programId ,
          page: this.rating_page,
        };
        this.getRating(data)
      
        console.log("lllllllll")
        // this.getOneDaywise()
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

  getOneDaywise() {
    this.mentorService.getOneProgram(this.programId).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.programData = res.data;
        console.log(this.programData,"this.programData")
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
  goBack(): void {
    this.location.back();
  }
  // getStarWidth() {
  //   const percentage = (this.rating / this.maxRating) * 100;
  //   return `${percentage}%`;
  // }

  isStartDateGreaterThanToday(): boolean {
    const today = new Date();
    const startDate = new Date(this.programData.start_date);
    return startDate > today;
  }
  
  
}
