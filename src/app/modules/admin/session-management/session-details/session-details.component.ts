import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent extends AuthorizationToken implements OnInit {

  imageLoaded: boolean = false;
 
  id:any;
  oneSessionDetail:any = [];
  imgsrc: any;
  showImage: any = environment.urlBackend;
  loginError:any;
  errortext : any;
  constructor(
    private mentorService :  MentorServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,

  ) { 
    super()
    this.id = this.getLocalStorageID();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val:any) => {
      this.id = val.session_id;
      console.log(this.id,"kkkkk")
			this.getOneSessionDetails();
    })
  }

  getOneSessionDetails() {

    this.mentorService.getOneDaywise(this.id).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
       
        this.oneSessionDetail = res.data;
        console.log(this.oneSessionDetail.program_id.mentorship_name,"this.oneSessionDetail")
        this.imgsrc = this.oneSessionDetail.image ? this.showImage + this.oneSessionDetail.image : '../../../../../assets/images/uploadProfile.png'

        this.imageLoaded = true;

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
