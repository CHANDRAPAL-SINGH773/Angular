import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "src/app/Services/admin/admin.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-mentorship-program",
  templateUrl: "./mentorship-program.component.html",
  styleUrls: ["./mentorship-program.component.scss"],
})
export class MentorshipProgramComponent
  extends AuthorizationToken
  implements OnInit {
  tabCollapse: boolean = true;
  loginError: any;
  errortext: any;
  oneUserData: any = [];
  id: any;
  mentorship_page: any = 1;
  totaldocs: any = 0;
  catName: any = [];
  count: any;
  showImage: any = environment.urlBackend;
  undersection: any = [];
  allDataInfo: any = [];
  today = new Date().toISOString().split("T")[0];
  activeAccordion: number = 0;
  tabsOpen: any = "";
  created: any;
  show: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService
  ) {
    super();
    this.id = this.getLocalStorageID();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.created = val.type;

    });
    console.log(this.created, " this.created ");

    let data = {
      filter: "",
      id: this.id,
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);
  }
  // tabs(id:any){
  //   console.log(id);

  //   if (this.tabCollapse =false  && id ==1)
  //   {this.tabCollapse =true}
  //   if (this.tabCollapse =true  && id ==1)
  //   {this.tabCollapse =false}

  // }

  openTab(id: any) {
    this.tabsOpen = id;
  }
  getmentorshipDetails(data: any) {
    this.mentorservice.getmentorshipDetails(data).subscribe(
      (res: any) => {
        this.show = true;
        if (res.status === "Success" && res.messageID === 200) {
          this.count = res.data;
          this.oneUserData = res.data.docs;

          this.totaldocs = res.data.totalDocs;

          // this.oneUserData.map((m1:any)=>{
          //   m1.docs }).filter((el:any)=>{

          //   console.log(el.expiry_date,"el.expiry_date");

          //   if(el.expiry_date > this.today){

          //   this.allDataInfo.push(el)
          // 	console.log("TCL: MentorshipProgramComponent -> getmentorshipDetails ->this.allDataInfo", this.allDataInfo)

          // }

          // })
        }
      },
      (err: any) => {
        this.show = true;
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
  selectOption(event: any) {
    let data = {
      filter: "",
      page: this.mentorship_page,
    };
    this.getmentorshipDetails(data);
  }
  pageChange(page: any) {
    let data = {
      filter: "",
      page: page,
      id: this.id,
    };
    this.mentorship_page = page;
    this.getmentorshipDetails(data);
  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.mentorship_page,
      id: this.id,
    };
    this.getmentorshipDetails(data);
  }
  addnewProgram() {
    this.router.navigate(["mentor/mentor-dashboard/add-newprogram"]);
  }

  toggleAccordion(index: number) {
    console.log(index, "index");

    if (this.activeAccordion === index) {
      this.activeAccordion = 0;
    } else {
      this.activeAccordion = index;
    }
  }
}
