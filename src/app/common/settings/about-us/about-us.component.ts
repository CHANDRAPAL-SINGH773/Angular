import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  content:any = [];
  loginError:any;
  errortext :any;

  constructor(
    private toastr : ToastrService,
    private mentorservice : MentorServiceService
  ) { }

  ngOnInit(): void {
    this.getStaticPages();
  }

  getStaticPages() {
    let body = {
      type: "About Us",
    };
    this.mentorservice.getStaticPages(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.content = res.data;
          console.log(this.content, "content");
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          this.toastr.error(res.message, res.status);
        } else if (res.status === "Failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else if (res.status === "Failed" && res.messageID === 404) {
          // this.toastr.error(res.message, res.status);
        } else {
          this.loginError = true;
          this.errortext = res.message;
          // this.toastr.error(res.message, res.status);
        }
      }
    );
  }

  stripTags(html: any) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
  }
}
