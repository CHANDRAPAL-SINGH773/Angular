import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mentorship-program-details',
  templateUrl: './mentorship-program-details.component.html',
  styleUrls: ['./mentorship-program-details.component.scss']
})
export class MentorshipProgramDetailsComponent extends AuthorizationToken implements OnInit {
  tabCollapse: boolean = true;
  loginError: any;
  errortext: any;
  oneUserData: any = [];
  id: any;
  showImage: any = environment.urlBackend;
  mentorship_page: any = 1;
  catName: any = [];
  count: any = [];
  cat_id: any;
  showHeading: any;
  catId: any;
  totaldocs: any = 0;
  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService) {
    super();
    this.id = this.getLocalStorageID();

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.cat_id = val._id;

    });
    let data = {
      filter: "",
      mentorid: this.id,
      category_id: this.cat_id,
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);
  }

  getmentorshipDetails(data: any) {
    this.mentorservice.getmentorshipDetailsByCategory(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.count = res.data;
        this.oneUserData = res.data.docs;
        console.log(res.data, "oneUserDataoneUserData");

        this.totaldocs = res.data.totalDocs;
        this.oneUserData.map((t1: any) => {
          this.showHeading = t1.category_id[0].categoryName;
          this.catId = t1.category_id[0]._id;

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
  selectOption(event: any) {
    let data = {
      filter: "",
      page: this.mentorship_page,
      mentorid: this.id,
    };
    this.getmentorshipDetails(data);

  }
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
      mentorid: this.id,
      category_id: this.catId
    };
    this.mentorship_page = page;
    this.getmentorshipDetails(data);
  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.mentorship_page,
      mentorid: this.id,
      category_id: this.catId
    };
    this.getmentorshipDetails(data);
  }
  addnewProgram() {
    this.router.navigate(['mentor/mentor-dashboard/add-newprogram'])
  }

}
