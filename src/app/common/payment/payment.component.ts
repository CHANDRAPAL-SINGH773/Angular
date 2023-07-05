import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { AuthorizationToken } from "../../Shared/token";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as ExcelJS from 'exceljs';

@Component({ 
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent extends AuthorizationToken implements OnInit {
  totaldocs: any;
  today: Date = new Date();
  showImage: any = environment.urlBackend;
  id: any;
  payment_page: number = 1;
  loginError: any;
  errortext: any;
  // paymentData: any;
  totalAmount:number =0
  total: number = 0;
  tiptotal: number = 0;
  payDate: any;
  myDate = new Date();
  curdate: any;
  year: any;
  currentWeek: any;
  now = new Date();
  startsDate: any;
  endsDate: any;
  forDayActive: boolean = false;
  getTabId: string = "forDay";
  content:any;
  mydata:any={};
  paymentData: any[] = []; // your payment data
  allPaymentData:any = [];
  startDate: any;
  endDate: any;
  filteredData: any[] = [];
  filteredPaymentData: any[] = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private mentorService: MentorServiceService
  ) {
    super();
    this.id = this.getLocalStorageID();
  }
  getid(id: any) {
    this.getTabId = id;
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
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
    this. mentorPaymentDetails();
    this.allPaymentDetails(data)
    // const currentDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() // Start of the current day
    // const nextDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime()
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
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
  }
  forWeek() {
    this.startDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() - this.now.getDay()
    ).getTime();
    this.endDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + (6 - this.now.getDay())
    ).getTime();
    let data = {
      filter: "",
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
  }
  forMonth() {
    this.startDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      1
    ).getTime();
    this.endDate = new Date(
      this.now.getFullYear(),
      this.now.getMonth() + 1,
      1
    ).getTime();
    let data = {
      filter: "",
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
  }
  forYear() {
    this.startDate = new Date(this.now.getFullYear(), 0, 1).getTime();
    this.endDate = new Date(this.now.getFullYear() + 1, 0, 1).getTime() - 1;
    let data = {
      filter: "",
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
  }

  paymentDetails(data: any) {
    this.mentorService.paymentDetails(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.paymentData = res.data;
          // this.totalAmount=res.totalAmount

          this.totaldocs = res.data.totalDocs;
          console.log(
            "TCL: PaymentComponent -> paymentDetails ->  this.paymentData",
            this.paymentData
          );

          this.total = 0;
        
          this.tiptotal = 0;
          const value = this.paymentData.map((r1: any) => {
            if (r1.type != "tip") {
              (this.total += r1.amount);
          }
          //   if (r1.type == "tip") {
          //    (this.tiptotal += r1.amount);             
          //   }
          });
         
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
      filter: "",
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.payment_page,
    };
    this.paymentDetails(data);
  }

  pageChange(page: any) {
    let data = {
      filter: "",
      mentor_id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      page: page,
    };
    this.payment_page = page;
    this.paymentDetails(data);
  }

  openPreviewModal() {
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

  
  generatePDF() {
    this.content = document.getElementById('report');
  
    html2canvas(this.content).then((canvas:any) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
  
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('my-pdf-document.pdf');
    });
  }  

  filterData() {
    if (this.startsDate && this.endsDate) {
      this.filteredPaymentData = this.allPaymentData.filter((payment:any) => {
        const paymentDate = new Date(payment.updatedAt);
        return paymentDate >= new Date(this.startsDate) && paymentDate <= new Date(this.endsDate);
      });
    } else {
      this.filteredPaymentData = this.allPaymentData;
    }
  }


  generateExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payments');
  
    // Define column headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Amount', key: 'amount', width: 20 },
      { header: 'Type', key: 'type', width: 20 },
    ];
  
    // Add rows to worksheet
    this.filteredPaymentData.forEach((data) => {
      worksheet.addRow({
        name: data.firstName ? data.firstName + ' ' + data.lastName : '-',
        date: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : '-',
        amount: data.amount ? data.amount : '-',
        type: data.type ? data.type : '-',
      });
    });
  
    // Add auto filter to worksheet
    worksheet.autoFilter = {
      from: 'A1',
      to: 'G1',
    };
  
    // Generate Excel file
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

  mentorPaymentDetails(){
    this.mentorService.mentorPaymentDetails(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.mydata = res.data;
          console.log("iuuuuuuuu",   this.mydata )
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

  allPaymentDetails(data: any){
    this.mentorService.allPaymentDetails(data).subscribe((res:any)=>{
      this.allPaymentData = res.data
      console.log(this.allPaymentData,"resssssssss")

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
    })

  }
  
}
