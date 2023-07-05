import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';

@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.css']
})
export class PaymentManagementComponent implements OnInit {

  loginError: any;
  errortext: any;
  payementData: any;
  payment_page: any = 1;
  status: any;
  totaldocs: any;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    let data = {
      filter: "",
      status: this.status,
      page: this.payment_page,
    };
    this.getAllPaymentDetails(data);
  }

  getAllPaymentDetails(data: any) {
    this.adminService.getAllPaymentDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.payementData = res.data.docs;
        console.log(this.payementData, "dta cacell")
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
      page: this.payment_page,
      status: this.status,
    };
    this.getAllPaymentDetails(data);
  }

  pageChange(page: any) {
    let data = {
      filter: "",
      status: this.status,
      page: page,
    };
    this.payment_page = page;
    this.adminService.getAllPaymentDetails(data).subscribe((res) => {
    });
  }

  selectOption(event: any) {
    this.status = event.target.value;
    let data = {
      filter: "",
      status: this.status,
      page: this.payment_page,
    };
    this.getAllPaymentDetails(data);
  }
}
