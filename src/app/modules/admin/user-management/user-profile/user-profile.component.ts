import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  id: any;
  loginError: any;
  errortext: any;
  oneUserData: any=[];
  showImage: any = environment.urlBackend;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val:any) => {
      this.id = val.user_id;
			this.getOneUser();
    })

  
}
getOneUser(){

  this.adminService.getUser(this.id).subscribe((res: any) => {
    if (res.status === "Success" && res.messageID === 200) {
      this.oneUserData = res.data;
    
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

// getpath(image:any)
// {
//  return image?`${environment.urlBackend}/upload/image/${image}`:'../../../assets/ekg/img9.svg';
// }
}


