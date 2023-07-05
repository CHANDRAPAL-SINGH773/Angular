import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/Services/admin/admin.service';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-payment-settelment',
  templateUrl: './payment-settelment.component.html',
  styleUrls: ['./payment-settelment.component.scss']
})
export class PaymentSettelmentComponent implements OnInit {
  today: Date = new Date();
  // startDate: Date = new Date();
  // endDate: Date = new Date();
  startDate: any;
  endDate: any;
  loginError: any;
  errortext: any;
  payementData: any;
  payment_page: any = 1;
  status: any;
  totaldocs: any;
  // filteredPaymentData : any = [];
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
    this.transferPaymentGetAll(data);
  }


  transferPaymentGetAll(data: any) {
    this.adminService.transferPaymentGetAll(data).subscribe((res: any) => {
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

    };

    this.transferPaymentGetAll(data);



  }
  pageChange(page: any) {

    let data = {
      filter: "",
      status: this.status,
      page: page,
    };
    this.payment_page = page;
    this.adminService.transferPaymentGetAll(data).subscribe((res) => {


    });
  }

  openPreviewModal(){
    const previewModal = document.getElementById("preview-modal");
    if (previewModal != null) {
      previewModal.style.display = "block";
    }
  }

  closePreviewModal() {
    const previewModal = document.getElementById("preview-modal");
    if (previewModal != null) {
      previewModal.style.display = "none";
    }
  }

  filteredPaymentData: any[] = [];
 
  
  filterData() {
    if (this.startDate && this.endDate) {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      this.filteredPaymentData = this.payementData.filter((data:any) => {
        const paymentDate = new Date(data.program_data[0].updatedAt);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
    } else {
      this.filteredPaymentData = this.payementData;
    }
  }
  


 downloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payment Settelment List');

    worksheet.columns = [
      { header: 'Program Name', key: 'programname', width: 20 },
      { header: 'Mentor Name', key: 'mentorname', width: 20 },
      { header: 'Amount', key: 'amount', width: 20 },
      { header: 'Mentor Amount', key: 'mentoramount', width: 20 },
      { header: 'Admin Amount(Commission Percentage)', key: 'adminamount', width: 20 },
    ];


    this.filteredPaymentData.forEach((data:any) => {
      worksheet.addRow({
        programname:  data.program_data[0]?.mentorship_name,
        mentorname : data.mentor_data[0]?.firstName,
        amount: data.totalProgramAmount ,
        mentoramount :data.transferAmount ,
        adminamount: `${data.adminAmount} (${data.adminCommissionPercentage}%)`,
      });
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };

    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `payments_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

}
