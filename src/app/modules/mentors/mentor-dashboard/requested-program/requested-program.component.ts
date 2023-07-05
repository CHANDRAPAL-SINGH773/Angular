import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';

@Component({
  selector: 'app-requested-program',
  templateUrl: './requested-program.component.html',
  styleUrls: ['./requested-program.component.scss']
})
export class RequestedProgramComponent implements OnInit {
  loginError: any;
  errortext: any;
  oneUserData: any;
  newMentorshipPage: number = 1;
  totalItems:number =5;
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
        this.oneUserData = res.data.docs;
        this.totalItems = res.data.totalDocs;
    
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
      page: this.newMentorshipPage,
    };

    this.getAllNewMentorshipProgram(data);
  }
}
