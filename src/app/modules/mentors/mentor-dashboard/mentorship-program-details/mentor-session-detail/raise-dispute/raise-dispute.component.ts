import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { Router ,ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-raise-dispute',
  templateUrl: './raise-dispute.component.html',
  styleUrls: ['./raise-dispute.component.scss']
})
export class RaiseDisputeComponent extends AuthorizationToken implements OnInit {
  user_id: any;
  loginError: any;
  errortext: any;
  programid: any;
  allData: any=[];
  detailPage: any = 1;
  today = new Date().toISOString().split("T")[0];
  start_date: any;
  myArray:any=[];
  showImage: any = environment.urlBackend;
  totaldocs: any = 0;
  constructor(private route: ActivatedRoute,
    private mentorservice: MentorServiceService,
    private router:Router,
    private location: Location,
    private menteeservice:MenteeService,
    private toastr: ToastrService,) {
      super()
      this.user_id = this.getLocalStorageID();
      this.route.queryParams.subscribe((val: any) => {
        this.programid = val.program_id;
  
      });
     }

  ngOnInit(): void {
    let data = {
      filter: "",
      program_id: this.programid,
      mentorid: this.user_id,
      page: this.detailPage,
    };
    this.getallDetails(data)
  }
  getallDetails(data: any) {
    this.mentorservice.getallprogramDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
       this.myArray=[];
        this.allData = res.data.docs;
        this.totaldocs = res.data.totalDocs;
        this.allData.map((element:any)=>{
          this.start_date=element.start_date
          let start_date=element.start_date
        if(start_date < this.today){
         this.myArray.push(element)

        }
      }) 
    
        
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
  pageChange(page: any) {
    let data = {
      filter: "",
      program_id: this.programid,
      mentorid: this.user_id,
      page: this.detailPage,
    };
    this.detailPage = page;
    this.getallDetails(data)
  }
  back(){
    this.location.back();
  }
}
