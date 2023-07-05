// import { Injectable, Injector } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
// import { AuthorizationToken } from '../../Shared/token';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { catchError, Observable, tap, throwError } from 'rxjs';
// import { ToastrService } from "ngx-toastr";
// import { Router, ActivatedRoute } from "@angular/router";
// @Injectable({
//   providedIn: 'root'
// })
// export class InterceptorService implements HttpInterceptor {

//   constructor(private injector: Injector, private auth: AuthorizationToken, private toastr:ToastrService,private router:Router,
//     request: HttpRequest<unknown>, next: HttpHandler) {    console.log("Tanay"); }

//   //   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//   //   console.log("Tanay");
//   //   // //${this.auth.gettoken()}
//   //   //   let authService= this.injector.get(AuthService)
//   //   //    let tokenizeReq = req.clone({setHeaders:{ Authorization: `${this.auth.gettoken()}`}})
//   //   //    console.log("TCL: InterceptorService -> intercept -> tokenizeReq", tokenizeReq)

//   //   //    return next.handle(req)
//   //   //    }
//   //   let authReq;
//   //   authReq = request.clone({
//   //     headers: new HttpHeaders({
//   //       'Access-Control-Allow-Origin': '*',
//   //       'Content-Type': 'application/json',
//   //       'SessionId': 'uigygyu'
//   //     })
//   //   });
//   //   if (this.auth.gettoken()) {
//   //     authReq = request.clone({

//   //       headers: new HttpHeaders({
//   //         'token': `${this.auth.get()}`
//   //       })
//   //     });
//   //   } else {
//   //     authReq = request.clone();
//   //   }

//   //   return next.handle(authReq)
//   //     .pipe(
//   //       tap((evt: HttpEvent<any>) => {
//   //         if (evt instanceof HttpResponse) {
//   //         }
//   //       }),
//   //       catchError((response: HttpErrorResponse) => {
//   //         if (response.status === 401) {
//   //           if (this.auth.gettoken()) {
//   //             this.auth.logout();
//   //             this.toastr.error('Token Expired.');
//   //             this.router.navigateByUrl('login');
//   //           }
//   //         }
//   //         if (response.error instanceof ErrorEvent) {
//   //         }
//   //         if (response.error instanceof ProgressEvent) {
//   //         }
//   //         return throwError(response);
//   //       })
//   //     );
//   // }
// }
