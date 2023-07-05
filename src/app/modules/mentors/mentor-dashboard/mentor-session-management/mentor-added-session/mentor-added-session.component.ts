import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { environment } from "src/environments/environment";
import { ClipboardService } from 'ngx-clipboard';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from "@angular/forms";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-mentor-added-session",
  templateUrl: "./mentor-added-session.component.html",
  styleUrls: ["./mentor-added-session.component.scss"],
})
export class MentorAddedSessionComponent extends AuthorizationToken implements OnInit {
  online: boolean = true;
  id: any;
  loginError: any;
  errortext: any;
  oneSessionDetail: any;
  imgsrc: any = '';
  mode: any;
  showImage: any = environment.urlBackend;
  programid: any;
  pid: any;
  sharelocationForm: FormGroup;
  submitted: boolean = false;
  shareDetail: any;
  userList: any = [];
  mylist:Array<string>=[];
  mentorID: any;
  logedinName:any;
  attendanceList: any=[];
  canTrack:boolean=false;
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorService: MentorServiceService,
    private menteeService: MenteeService,
    private clipboardApi: ClipboardService
  ) {
    super();
    this.mentorID = this.getLocalStorageID();
    this.logedinName=this.getLocalStorageByName();
    this.sharelocationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.id = val.user_id;
      this.mode = val.mode
      this.getOneDaywise();
    })
  }


  getOneDaywise() {

    this.mentorService.getOneDaywise(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.oneSessionDetail = res.data;

        let today = new Date()

       let  formattedDate = this.datePipe.transform(today, 'yyyy-MM-ddT00:00:00.000Z');
       let trimDate= this.oneSessionDetail.start_date.split('T')[0];
                let todayDate =formattedDate?.split('T')[0]
        if(trimDate===todayDate){
        
        this.canTrack=true
  
        }else{
          
          this.canTrack=false
        }
        console.log(this.canTrack,"KKKKKKKKKKKK",trimDate,todayDate,);

        this.shareDetail =
        `
        Program Name - ${this.oneSessionDetail.program_id.mentorship_name} 
        Session Name - ${this.oneSessionDetail.session_name}    
        Start Time - ${this.oneSessionDetail.time}
        Meeting Location- ${this.oneSessionDetail.location} `
        this.imgsrc = `${this.oneSessionDetail.image}` ? `${environment.urlBackend}${this.oneSessionDetail.image}` : "../../../../../assets/images/uploadProfile.png";

        this.programid = res.data.program_id._id

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
  editSession() {
    if(this.mode==0){
    this.router.navigate(['/mentor/mentor-dashboard/edit-session'],
      { queryParams: { edit: this.id ,onlineMode:false} })
    }else{
      this.router.navigate(['/mentor/mentor-dashboard/edit-session'],
      { queryParams: { edit: this.id,onlineMode:true } })
    }
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
  copyText() {
    this.toastr.show("Session link copied")
    this.clipboardApi.copyFromContent(this.oneSessionDetail.session_link)

  }

  goTomap() {
    this.pid = this.programid;
    let sid = this.id;
    this.router.navigate(['/showmap'], { queryParams: { pid: this.pid, sid: sid } })
  }

  sendEmail() {

    this.submitted = true
    if (!this.sharelocationForm.valid) {
      return
    }

    let emailFields = {
      email: this.sharelocationForm.get('email')?.value,
      description: this.shareDetail,
      userId: this.id
    }


    this.menteeService.shareLocation(emailFields).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.submitted=false;
        this.sharelocationForm.reset()
        // window.location.href="/mentor/mentor-dashboard/refer&earn"
        //this.toastr.success("Email sent successfully");
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


  getAllresigsterMentees() {
    let data = {
      program_id: this.programid,
      page: 1,
      filter: ''
    }
    this.mentorService.getAllresigsterMentees(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.userList = res.data.docs;
        console.log(this.userList,"this.userList");
        
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

  getAttendance(){
    this.mentorService.getAttendance(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.toastr.success(res.message, res.status,);
        this.attendanceList = res.data.attendedMentee;
        console.log(this.attendanceList,"   this.attendanceList ");
        
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
        // this.toastr.error(res.message, res.status);
      }
    })
  }

  markAttendance() {
    let allData={
      attendedMentee:this.mylist,
      sessionId:this.id,
      programId:this.programid,
      mentorID:this.mentorID,
      markedBy:"mentor"
    }


    this.mentorService.menteeattendance(allData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.toastr.success(res.message, res.status,);
       this.getAttendance()
     
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

    checkboxCheck(id:any,ischecked:any){
 
      if (id && ischecked.target.checked) {
        if(!this.mylist.includes(id)){
          this.mylist.push(id)
        }
        

      } 
      else {
        let index= this.mylist.indexOf(id)
       this.mylist.splice(index, 1)
     
       
      }
      console.log(  this.mylist,"  this.mylist");
    }
    convertTimeFormat(time: string): string {
      const parts = time.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parts[1] || '00'; // Set minutes to '00' if not provided
    
      // Convert hours to 12-hour format
      const formattedHours = hours % 12 || 12;
      const period = hours >= 12 ? 'PM' : 'AM';
    
      // Add leading zero for single-digit hours
      const formattedHoursString = formattedHours < 10 ? '0' + formattedHours : formattedHours.toString();
    
      return formattedHoursString + ':' + minutes + ' ' + period;
    }
}
