import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from 'src/app/Shared/token';


@Component({
  selector: 'app-mentorship-program',
  templateUrl: './mentorship-program.component.html',
  styleUrls: ['./mentorship-program.component.scss']
})
export class MentorshipProgramComponent extends AuthorizationToken  implements OnInit {
  loginError: any;
  errortext: any;
  programList: any=[];
  programPage:number = 1;
  user_Id:any;
  showImage: any = environment.urlBackend;
  totaldocs: any = 0;
  today = new Date().toISOString().split("T")[0];
  expDate: any;
  pastPrograms:any;
  currentPrograms:any;
  state: string = 'current';
  loadData:boolean=false;


  constructor(private menteeService: MenteeService,
    private route: ActivatedRoute,
    private router:Router,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
    ) { 
      super();
      this.user_Id = this.getLocalStorageID();
    }

  ngOnInit(): void {
    console.log( this.user_Id," this.user_Id");
    
    let data = {
      filter: "",
      user_Id:this.user_Id,
      page: this.programPage,
    };
    this.getpurchasedPrograms(data)
  }

  changeState(state: string) {
    this.state= state;
    }
  getpurchasedPrograms(data: any) {
    
    
    this.menteeService.getpurchasedPrograms(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.programList = res.data.docs;
        this.pastPrograms=[];
        this.currentPrograms=[];
        this.loadData=true;
        this.programList.filter((ele:any)=>{
         
          
          this.expDate=ele.expiry_date
          if(this.today >  this.expDate){
            this.pastPrograms.push(ele)
           }
           if(this.today <  this.expDate){
            this.currentPrograms.push(ele)
           }
        })
        console.log(this.expDate,"<<<<>>>>>",this.today );
 
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
  pageChange(page:any){
    let data = {
      filter: "",
      user_Id:this.user_Id,
      page: this.programPage,
    };
    this.programPage = page;
    this.getpurchasedPrograms(data)
  }
  onKeyUpEvent(event: any) {
    let data={
      filter: event.target.value,
      user_Id:this.user_Id,
      page: this.programPage,
  }
  this.getpurchasedPrograms(data)
  }



}
