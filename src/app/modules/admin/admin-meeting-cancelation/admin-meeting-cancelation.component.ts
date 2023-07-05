import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';

@Component({
  selector: 'app-admin-meeting-cancelation',
  templateUrl: './admin-meeting-cancelation.component.html',
  styleUrls: ['./admin-meeting-cancelation.component.scss']
})
export class AdminMeetingCancelationComponent implements OnInit {
  loginError: any;
  errortext: any;
  cancelationData: any;
  cancellation_page: any = 1;
  status: any;
  totaldocs: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    let data = {
      filter: "",
      status: this.status,
      page: this.cancellation_page,
    };
    this.getMentorshipPath(data);
  }


  getMentorshipPath(data: any) {
    this.adminService.getAllCancelMeetingsAdmin(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.cancelationData = res.data.docs;
        console.log(this.cancelationData, "dta cacell")
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


  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.cancellation_page,

    };

    this.getMentorshipPath(data);



  }
  pageChange(page: any) {

    let data = {
      filter: "",
      status: this.status,
      page: page,
    };

    this.getMentorshipPath(data);
  }
}
