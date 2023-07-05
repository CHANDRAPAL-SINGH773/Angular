import { Component, OnInit } from '@angular/core';
import { AuthorizationToken } from "../../Shared/token";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { ClipboardService } from "ngx-clipboard";
import { environment } from "src/environments/environment";
import { FormControl, FormGroup, Validators, FormBuilder,} from '@angular/forms';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss']
})
export class ReferAndEarnComponent extends AuthorizationToken implements OnInit {
  hello: any;
  refralcode: any;
  rewardData: any=[];
  loginError: any;
  errortext: any;
  id: any;
  page: number = 1;
  myreferalcode:any;
  inviteForm:FormGroup;
  submitted:boolean=false;
  showButton:boolean=false;
  mentors: any=[];
  mentees: any=[];
  reward_amount: any={};
  reward_amountofMentee: any;
  role:any;
  refToMentorCount: any;
  refToMenteeCount:any;
  constructor(private router: Router,
    private toastr: ToastrService,
    private menteeService: MenteeService,
    private mentorService:MentorServiceService,
    private clipboardApi:ClipboardService,) {
    super()
    this.id = this.getLocalStorageID()
    this.role=this.getLocalStorageRole()
    // this.myreferalcode=this.getLocalStorageReferalCode()

    this.inviteForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      body: new FormControl(''),
    })
    

  }

  
  ngOnInit(): void {
    let data = {
      filter: "",
      user_id: this.id,
      page: this.page,
    };
    this.getrewards(data)
    this.showreferalCode()
    
    if(this.role===2){
      this.rewardAmountForMentee()
  
    }else{
      this.rewardAmount()
    }

  }

  getrewards(data: any) {
    this.menteeService.getrewards(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.rewardData = res.data.docs;
        this.refToMentorCount=res.refToMentorCount
        this.refToMenteeCount=res.refToMenteeCount
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
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
      user_id: this.id,
    };
    this.page = page;
    this.getrewards(data);
  }
  copyText(){
    this.toastr.info("Referal code copied")
    this.clipboardApi.copyFromContent(this.myreferalcode)
  }


  sendEmail(){
    this.submitted = true
    if (!this.inviteForm.valid) {
      return
    }
    
  let emailFields={
  email:this.inviteForm.get('email')?.value,
  description:this.hello,
  userId: this.id 
}


    this.menteeService.helpSupport(emailFields).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        
        // window.location.href="/mentor/mentor-dashboard/refer&earn"
        this.toastr.success("Thank you ! Email sent successfully");
        this.inviteForm.reset();  
        





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


  setContent(){
    this.hello = `Hello,
    You are invited to use Pxalm Mentorship App.
    You can use my referral code to register - ${this.myreferalcode} 
    You can register using following link
   'https://mean.stagingsdei.com:9193/login' or To access on mobile app - iOS
    https://apps.apple.com/us/app/psalm/id6448251367

    Android
   Coming Soon`;


  }

  showreferalCode(){
    this.menteeService.showreferalCode(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.toastr.success(res.message, res.status);
        this.myreferalcode = res.data;
       
        if(this.myreferalcode && this.myreferalcode !== ""){

          this.showButton=true;
          this.setContent()
        }



      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
      } else if (res.status === "Failed" && res.messageID === 400) {
        this.toastr.info(res.message, res.status);
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

  rewardAmount(){
    this.mentorService.rewardAmount(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.toastr.success(res.message, res.status);
        this.reward_amount = res.data;

      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
      } else if (res.status === "Failed" && res.messageID === 400) {
        this.toastr.error(res.message, res.status);
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

  rewardAmountForMentee(){
    this.mentorService.rewardAmountForMentee(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.toastr.success(res.message, res.status) 
        this.reward_amount = res.data;

      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
      } else if (res.status === "Failed" && res.messageID === 400) {
        this.toastr.error(res.message, res.status);
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
