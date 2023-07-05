import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';

@Component({
  selector: 'app-referal-management',
  templateUrl: './referal-management.component.html',
  styleUrls: ['./referal-management.component.scss']
})
export class ReferalManagementComponent implements OnInit {
  loginError: any;
  errortext: any;
  oneUserData: any;
  newMentorshipPage: any = 1;
  totaldocs: any;
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.newMentorshipPage,
    };
    this.getallReward(data);
  }

  getallReward(data: any) {
    this.adminService.getallReward(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.oneUserData = res.data.docs;
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
      page: page,
    };
    this.newMentorshipPage = page;
    this.getallReward(data);
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      orderBy: [],
    };

    this.getallReward(data);
  }

}
