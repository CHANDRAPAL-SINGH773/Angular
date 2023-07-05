import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService{
  url = environment.apiUrl;
  token: any;
  // token: any;
  headerOption:any;

  constructor(private http: HttpClient,
     ) { }

  verifyOTP(token: any, body: any) {
    let headerOption = {
      Authorization: token,
    };
    const headers = new HttpHeaders(headerOption);
    const option = { headers: headers };
    return this.http.post(this.url + `/auth/otpverify`, body, option);
  }
  resendOTP(token: any) {
    let headerOption = {
      Authorization: token,
    };
    const headers = new HttpHeaders(headerOption);
    const option = { headers: headers };
    return this.http.get(this.url + `/auth/resendotp`, option);
  }
  forgotPassword(body: any) {
    return this.http.get(this.url + `/auth/forgot-password?email=${body}`);
  }


  resetPassword(token: any, body: any) {
    let headerOption = {
      Authorization: token,
    };
    const headers = new HttpHeaders(headerOption);
    const option = { headers: headers };
    return this.http.post(this.url + `/auth/create-password`, body, option);
  }
  setTokenAndUserInfo(userDetails: any) {
    let data = {
      token: userDetails.token,
      role: userDetails.role,
      name: userDetails.name,
      _id: userDetails._id,
    }
    this.token = null;
    this.set(data);
    return true;
  }

  set(data: { token: any; role: any; name: any; _id: any; }) {
    localStorage.setItem("token", JSON.stringify({ data: data }));
  };

  allMentorCount(){
    return this.http.get(this.url + `/category/allMentorCount`);
  }
}
