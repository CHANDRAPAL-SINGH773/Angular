import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { AdminService } from "src/app/Services/admin/admin.service";

@Component({
  selector: "app-dispute-management",
  templateUrl: "./dispute-management.component.html",
  styleUrls: ["./dispute-management.component.scss"],
})
export class DisputeManagementComponent
  extends AuthorizationToken
  implements OnInit
{
  id: any;
  loginError: any;
  errortext: any;
  disputeList: any = [];
  pages: number = 1;
  showImage: any = environment.urlBackend;
  disputeId: any;
  submitted: boolean = false;
  replyForm: FormGroup;
  totaldocs: any = 0;
  startDate: any;
  endDate: any;
  filteredData: any[] = [];
  forDayActive: boolean = false;
  now = new Date();
  getTabId: string = "forDay";
  resolved: boolean = false;
  dateString = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate()
  ).getTime();
  start_Date = new Date(this.dateString).getTime()
  end_Date = new Date(this.dateString).getTime()
  raisedId: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService : AdminService
  ) {
    super();
    this.id = this.getLocalStorageID();
    this.replyForm = new FormGroup({
      adminReply: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {
    this.startDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate()
    ).getTime();
    this.endDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + 1
    ).getTime();
    let data = {
      filter: "",
      startDate:1686035894358,
      endDate: 1686035894358,
      page: this.pages,
    };
    this.allListOfDisputes(data);
  }

  forDay() {
    this.forDayActive = true;
    this.startDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate()
    ).getTime();
    this.endDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + 1
    ).getTime();
    let data = {
      filter: "",
      mentor_id: this.id,
      startDate: 1686035894358,
      endDate: 1686035894358,
      page: this.pages
    };
    console.log(data)
    this.allListOfDisputes(data);
  }

  allListOfDisputes(data:any) {
    this.mentorservice.getallDisputList(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.disputeList = res.data;
          console.log(
            "🚀 ~ file: disputes.component.ts:41 ~ DisputesComponent ~ this.mentorservice.listofDisputes ~   this.disputeList:",
            this.disputeList
          );

          this.disputeId = this.disputeList.find((item: any) => {
            return item._id;
          })?._id;
          
          console.log( this.disputeId ,"kjblo");
          
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }

  getId(id: any) {
    this.disputeId = id;
  }
  reply() {
    this.submitted = true;
    if (this.replyForm.valid) {
      this.resolved = true; 
    }
    let body = {
      id: this.disputeId,
      adminReply: this.replyForm.get("adminReply")?.value,
      // resolved : this.replyForm.get("resolved")?.value
    };

    this.mentorservice.adminReplyOnDispute(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);

          this.replyForm.reset();

          let data = {
            filter: "",
            page: this.pages,
          };
          this.allListOfDisputes(data);
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.pages,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.allListOfDisputes(data);
  }

  pageChange(page: any) {
    let data = {
      filter: "",
      page: this.pages,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.pages = page;
    this.allListOfDisputes(data);
  }

  filterData() {
    this.filteredData = this.disputeList.filter((data:any) => {
      const date = new Date(data.updatedAt);
      return date >= new Date(this.startDate) && date <= new Date(this.endDate);
    });
  }
  getResolutionStatus(resolved: string): string {
    if (resolved === 'resolved') {
      return 'Resolved';
    } else if (resolved === 'not resolved') {
      return 'Not Resolved';
    } else {
      return 'Not Resolved';
    }
  }
  
  onFilterChange() {
    let data = {
      filter: "",
      start_Date: this.start_Date,
      end_Date: this.end_Date,
      page: this.pages,
    };
    this.allListOfDisputes(data);
  }
  
  changeReplyStatus(event: any, raisedId: any) {
    console.log(raisedId,"raisedId")
    let resolved = event.target.checked;
    console.log(resolved)
    if (resolved === false) {
      resolved = "not resolved"
    } else {
      resolved = "resolved"
    }

    const body = {
      id: raisedId,
      resolved: resolved
    };
console.log(body,"body")

    this.adminService.updateDisputeReply(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          // this.toastr.success(res.message, res.status);
          // Handle success, update UI, etc.
          // 

        }
        let data = {
          filter: "",
          start_Date: this.start_Date,
          end_Date: this.end_Date,
          page: this.pages,
        };
        this.allListOfDisputes(data);
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );

  }
  
  
}
