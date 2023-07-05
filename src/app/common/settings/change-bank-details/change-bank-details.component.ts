import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { StripeCardComponent, StripeService } from "ngx-stripe";
import { StripeCardElementOptions, StripeElementsOptions } from "@stripe/stripe-js";

@Component({
  selector: 'app-change-bank-details',
  templateUrl: './change-bank-details.component.html',
  styleUrls: ['./change-bank-details.component.scss']
})
export class ChangeBankDetailsComponent extends AuthorizationToken implements OnInit {
  bankDetailsForm: FormGroup;
  loginError: any;
  errortext: any;
  submitted: boolean = false;
  isFormInvalid: boolean = true;
  bankData: any = [];
  currency: any = [];
  routing_number: any = [];
  account_number: any = [];
  accountNumberConfirm: any;
  notMatchedMessage: string = "Account Number does not match.";
  showNotMatchedMessage: boolean = false;
  constructor(private mentorService: MentorServiceService, private toastr: ToastrService,
    private stripeService: StripeService) {
    super()
    this.bankDetailsForm = new FormGroup({
      accountNumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(7)]),
      accountNumberConfirm: new FormControl('', Validators.required),
      rountingNumber: new FormControl('', Validators.required),
      currency: new FormControl('CAD')
    });
  }

  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  customerId = '';

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        // borderWidth: '1px',

        // borderRadius: '0.375rem !important',
        padding: '0.5rem !important',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        },


      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: any = FormGroup;
  cardDetails: any;

  ngOnInit(): void {
    this.mentorService.getAccountDetails().subscribe((res: any) => {
      this.bankData = res.data.external_accounts.data.map((item: any) => {
        return {
          currency: item.currency,
          routingNumber: item.routing_number,
          accountNumber: item.last4
        };
      });


      const firstBankAccount = this.bankData[0];

      // console.log(" firstBankAccount.routingNumber", firstBankAccount.routingNumber)
      this.bankDetailsForm.patchValue({
        currency: firstBankAccount.currency,
        accountNumber: firstBankAccount.accountNumber,
        routingNumber: firstBankAccount.routingNumber,
        accountNumberConfirm: firstBankAccount.accountNumber
      });
    },
      (err: any) => {
        console.log(err, "erorr");
      }
    )
  }

  validateForm(): void {
    console.log("check log validate Form");

    this.isFormInvalid = true;
    this.showNotMatchedMessage = false;
    const formValues = this.bankDetailsForm.value;
    const isFormValid: boolean = this.bankDetailsForm.valid;
    if (!isFormValid) {
      this.isFormInvalid = true;
    }
    if (isFormValid) {
      if (formValues.accountNumber != '' && (formValues.accountNumber != formValues.accountNumberConfirm)) {
        this.showNotMatchedMessage = this.isFormInvalid = true;
      }

      if ((formValues.accountNumber != '' && formValues.accountNumberConfirm != '') && (formValues.accountNumber === formValues.accountNumberConfirm)) {
        this.showNotMatchedMessage = this.isFormInvalid = false;
      }
    }
  }

  submit() {
    // try {
    this.submitted = true
    /* if (!this.bankDetailsForm.valid) {
      return
    }
    else { */
    this.stripeService.createToken(this.card.element, {
      currency: this.bankDetailsForm.get('currency')?.value
    }).subscribe((result: any) => {
      let data = {
        account_number: this.bankDetailsForm.get('accountNumber')?.value,
        routing_number: this.bankDetailsForm.get('rountingNumber')?.value,
        currency: this.bankDetailsForm.get('currency')?.value,
        card_token: result.token.id
      };
      console.log(this.bankDetailsForm.get('rountingNumber')?.value, "testttttttt");

      this.mentorService.createMentorAccount(data).subscribe((res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);

        }
      },
        (err: any) => {
          let res = err.error;
          this.toastr.error(res.message, res.status);
        }
      )
    })


    /*   } */
    // } catch (error) {
    //   console.log(error, "erorororo");
    // }
  }


}
