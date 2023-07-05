import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from "../../Shared/token";

@Injectable({
  providedIn: 'root'
})
export class AdminService extends AuthorizationToken {

  url = environment.apiUrl;
  headerOption: any;
  constructor(private http: HttpClient) {
    super();
    this.headerOption = this.gettoken()
  }

  updateUserByAdmin(updateJson: any) {
    return this.http.put(this.url + `/mentor/update`, updateJson, this.headerOption);
  }
  getUser(user_id: any) {
    return this.http.get(this.url + `/mentor/getUser?user_id=${user_id}`, this.headerOption);
  }
  // getpathDetail(id:any){
  //   return this.http.get(this.url + `/mentorship/getOne-mentorship?_id=${id}`,this.headerOption);
  // }
  statusChangeUser(data: any) {
    return this.http.put(this.url + `/mentor/update`, data, this.headerOption);
  }
  manageUser(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/mentor/getAll-users?filter=${data.filter}&page=${data.page}&roles=${data.roles}`, headerOption);
  }

  addCategory(addJson: any) {

    return this.http.post(this.url + `/category/add`, addJson, this.headerOption);
  }
  updateCategory(updateJson: any) {
    return this.http.put(this.url + `/category/update`, updateJson, this.headerOption);
  }
  deleteCategory(id: any) {
    return this.http.put(this.url + `/category/delete`, id, this.headerOption);
  }
  updatePath(updateJson: any) {
    return this.http.put(this.url + `/mentorship/update`, updateJson, this.headerOption);
  }
  deleteCategoryPath(id: any) {
    return this.http.put(this.url + `/mentorship/delete`, id, this.headerOption);
  }
  statusCatPath(data: any) {
    return this.http.put(this.url + `/mentorship/update`, data, this.headerOption);
  }

  mentorshipCategory(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/mentorship/getAll-mentorship?filter=${data.filter}&page=${data.page}`, headerOption);

  }
  statusChangeCategory(data: any) {
    return this.http.put(this.url + `/category/update`, data, this.headerOption);
  }
  manageCategory(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/category/getAll-category?filter=${data.filter}&page=${data.page}`, headerOption);
  }

  getAllCategory(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/category/getAllCategory?filter=${data.filter}&page=${data.page}&status=${data.status}`, headerOption);
  }


  getSingleProgram(user_id: any) {
    return this.http.get(this.url + `/mentorship/getSingleProgram?_id=${user_id}`, this.headerOption);
  }

  getAllCategoryDropdown() {
    return this.http.get(this.url + `/category/getAllCategoryDropdown`, this.headerOption);
  }
  deleteUser(id: any) {
    return this.http.delete(this.url + `/mentor/deleteUser?_id=${id}`, this.headerOption);
  }

  getAllMediaPost(data: any) {
    return this.http.get(this.url + `/mentor/getAllMediaPost?filter=${data.filter}&page=${data.page}&status=${data.status}`, this.headerOption);
  }

  updateMediaStatus(updateJson: any) {
    return this.http.put(this.url + `/mentor/updateMediaStatus`, updateJson, this.headerOption);
  }


  getAllCancelMeetingsAdmin(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/mentorship/getAllCancelMeetingsAdmin?filter=${data.filter}&page=${data.page}&status=${data.status}`, headerOption);
  }


  getAllPaymentDetails(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/payment/getAllPaymentDetails?filter=${data.filter}&page=${data.page}&status=${data.status}`, headerOption);
  }

  paymentSettelment(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/payment/paymentSettelment?filter=${data.filter}&page=${data.page}&status=${data.status}`, headerOption);
  }
  changePassword(body: any) {
    return this.http.put(this.url + `/auth/changePassword`, body, this.headerOption);
  }

  getallReward(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(this.url + `/mentor/getallReward?filter=${data.filter}&page=${data.page}&status=${data.status}`, headerOption);
  }

  sessionList(data: any) {
    return this.http.get(this.url + `/mentorship/allSessionList?filter=${data.filter}&page=${data.page}&mentorship_mode=${data.mentorship_mode}&date=${data.startDate}&date=${data.endDate}`, this.headerOption)
  }

  updateDisputeReply(body: any) {
    return this.http.put(this.url + `/mentor/updateDisputeReply`, body, this.headerOption);
  }

  updateSessionStatus(body: any) {
    return this.http.put(this.url + `/mentor/updateSessionStatus`, body, this.headerOption);
  }

  getAllStaticPages() {
    return this.http.get(this.url + `/staticPages/getAllStaticPages`, this.headerOption)
  }

  getStaticPageById(_id: any) {
    return this.http.get(this.url + `/staticPages/getStaticPagesById?_id=${_id}`, this.headerOption)
  }

  updateStaticPages(updateJson: any) {
    return this.http.put(this.url + `/staticPages/updateStaticPage`, updateJson, this.headerOption);
  }

  transferPaymentGetAll(data: any) {
    return this.http.get(this.url + `/payment/transferPaymentGetAll?filter=${data.filter}&page=${data.page}`, this.headerOption)
  }

  adminDashboardStatsdetails() {
    return this.http.get(this.url + `/payment/adminDashboardStatsdetails`, this.headerOption)
  }

  allMentorMenteeList(){
    return this.http.get(this.url + `/mentor/allMentorMenteeList`, this.headerOption)

  }
}


// &start_date=${data.startDate}&expiry_date=${data.endDate}&current_date=${data.current_date}
