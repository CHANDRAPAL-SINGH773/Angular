import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';

@Component({
  selector: 'app-admin-requested-program-list',
  templateUrl: './admin-requested-program-list.component.html',
  styleUrls: ['./admin-requested-program-list.component.scss']
})
export class AdminRequestedProgramListComponent implements OnInit {

  loginError: any;
  errortext: any;
  oneUserData: any;
  newMentorshipPage: any = 1;
  totaldocs: any;
  constructor(
    private menteeService: MenteeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    let data = {
      filter: "",
      // category_id: this.catId,
      page: this.newMentorshipPage,
    };
    this.getAllNewMentorshipProgram(data);
  }

  getAllNewMentorshipProgram(data: any) {
    this.menteeService.getAllNewMentorshipProgram(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        // this.count = res.data;
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
    this.getAllNewMentorshipProgram(data);
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      orderBy: [],
    };

    this.getAllNewMentorshipProgram(data);
  }

}
