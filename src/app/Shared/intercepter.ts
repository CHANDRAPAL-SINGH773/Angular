import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
    constructor() { }
    data: any;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Perform any preprocessing before the request is sent

        this.data = localStorage.getItem("token");
        let dataToken = JSON.parse(this.data);
        let token = dataToken?.data?.token;

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${token}`,
                },
            });
        }


        // Pass the modified request to the next interceptor or to the HTTP handler
        return next.handle(request);
    }
}