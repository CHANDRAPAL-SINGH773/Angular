import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { Location } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
} from "@angular/forms";
import { onlyNumbersAllowed } from 'src/app/Shared/event-utils';
@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.scss']
})
export class AddBankAccountComponent implements OnInit {


  showImage: any = environment.urlBackend;
  addCardForm: FormGroup;
  submitted: boolean = false;
  loginError: any;
  errortext: any;
  selectedYear!: number;
  years: number[] = [];
  text: string = "text";
  password: string = "password";
  // conf: string = "password";
  // newPass:string="password"
  constructor(private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menteeService: MenteeService,
  ) {
    this.addCardForm = new FormGroup({
      number: new FormControl("", [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
      exp_month: new FormControl("", Validators.required),
      exp_year: new FormControl("", Validators.required),
      cvc: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    });
  }

  ngOnInit(): void {
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year <= 2050; year++) {
      this.years.push(year);

    }
  }

  addCard() {
    this.submitted = true;
    if (!this.addCardForm.valid) {
      return;
    }
    let body = {
      number: this.addCardForm.get("number")?.value,
      exp_month: Number(this.addCardForm.get("exp_month")?.value),
      exp_year: Number(this.addCardForm.get("exp_year")?.value),
      cvc: this.addCardForm.get("cvc")?.value,
    };

    this.menteeService.addCard(body).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
          this.location.back();

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
  togglePassword() {
    if (this.password === "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }



  //allow only number input 
  onlyNumbers(event:any) {
    onlyNumbersAllowed(event)
  }
}
