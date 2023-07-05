import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { noWhitespaceValidator } from 'src/app/Shared/event-utils';
// import { countryCodes } from 'src/app/Shared/event-utils';


// function noPlusSymbol(): ValidatorFn {
//   return (control: AbstractControl) => {
//     const value = (control as FormControl).value;
//     const hasPlusSymbol = value.includes('+');
//     return hasPlusSymbol ? { noPlus: true } : null;
//   };
// }
@Component({
  selector: 'app-request-new-program',
  templateUrl: './request-new-program.component.html',
  styleUrls: ['./request-new-program.component.scss']
})
export class RequestNewProgramComponent extends AuthorizationToken implements OnInit {
  errortext: any;
  loginError: any;
  submitted: boolean = false;
  newMentorProgramForm: FormGroup;
  id: any;
  numericValue: string = '';
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private menteeService: MenteeService,
    private router: Router,
  ) {



    super();
    // Validators.pattern("^[a-zA-Z]+$")
    this.id = this.getLocalStorageID();
    this.newMentorProgramForm = new FormGroup({
      programType: new FormControl('', [Validators.required, Validators.maxLength(40), noWhitespaceValidator()]),
      amount: new FormControl('', [Validators.required, Validators.min(1)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(400), noWhitespaceValidator()]),
    })



  }

  ngOnInit(): void {
  }

  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^0-9]/g, '');
    this.numericValue = sanitizedValue;
  }
  createNewMentorshipProgram() {

    this.submitted = true
    if (!this.newMentorProgramForm.valid) {
      return
    }

    let newProgramData = {
      programType: this.newMentorProgramForm.get('programType')?.value,
      amount: this.newMentorProgramForm.get('amount')?.value,
      description: this.newMentorProgramForm.get('description')?.value,
      userId: this.id,
      // session_id: this.sessionId

    }
    this.menteeService.createNewMentorshipProgram(newProgramData).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.toastr.success(res.message, res.status,);
        this.submitted = false
        this.newMentorProgramForm.reset();
      }
      this.router.navigate(["/mentee/mentee-dashboard/mentorship-programs"], { replaceUrl: true });
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
}
