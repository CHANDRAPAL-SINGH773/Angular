import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.scss']
})
export class MentorsComponent implements OnInit {
  UserData: any;
  loginError: any;
  errortext: any;
  usersPage: any = 1;
  imgsrc: any = '';
  totaldocs: any = 0;
  imagecategory: any = environment.urlBackend;
  constructor(private menteeService: MenteeService,
    private route: ActivatedRoute,
    private toastr: ToastrService,) {

  }
  
  ngOnInit(): void {
    let data = {
      filter: "",
      page: this.usersPage,
      roles: ""
    };
    this.getallUsers(data);
  }
  getallUsers(data: any) {
    this.menteeService.allMentor(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.UserData = res.data.docs;
        console.log( this.UserData )
        
        this.totaldocs = res.data.totalDocs;
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
      page: this.usersPage,
    };
    this.getallUsers(data);
  }

  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
    };
    this.usersPage = page;
    this.getallUsers(data);
  }
  getSkillNames(data:any): string {
    if (data.skills && data.skills.length > 0) {
      return data.skills.map((skill:any) => skill.skillName).join(', ');
    } else {
      return '-';
    }
  }
}
