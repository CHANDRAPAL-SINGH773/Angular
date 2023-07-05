import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "../../Shared/token";
@Injectable({
  providedIn: "root",
})
export class MentorServiceService extends AuthorizationToken {
  url = environment.apiUrl;
  headerOption: any;
  constructor(private http: HttpClient) {
    super();
    this.headerOption = this.gettoken();
  }

  signUpMentor(body: any) {
    return this.http.post(this.url + "/mentor/register", body, {});
  }
  login(body: any) {
    return this.http.post(this.url + "/auth/login", body);
  }

  getmentorshipDetails(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getAll-mentorship?filter=${data.filter}&page=${data.page}&mentorid=${data.id}`,
      this.headerOption
    );
  }
  getmentorshipDetailsByCategory(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getMentorshipById?filter=${data.filter}&page=${data.page}&mentorid=${data.mentorid}&category_id=${data.category_id}`,
      this.headerOption
    );
  }
  updateDayWise(updateJson: any) {
    return this.http.put(
      this.url + `/mentorship/daywiseUpdate`,
      updateJson,
      this.headerOption
    );
  }

  addDayWise(addJson: any) {
    return this.http.post(
      this.url + `/mentorship/dayWise`,
      addJson,
      this.headerOption
    );
  }

  getOneDaywise(session_id: any) {
    return this.http.get(
      this.url + `/mentorship/getOneDaywise?_id=${session_id}`,
      this.headerOption
    );
  }

  getOneProgram(program_id: any) {
    return this.http.get(
      this.url + `/mentorship/getSingleProgram?_id=${program_id}`,
      this.headerOption
    );
  }
  addProgram(add: any) {
    return this.http.post(this.url + `/mentorship/add`, add, this.headerOption);
  }
  editProgram(editJson: any) {
    return this.http.put(
      this.url + `/mentorship/update`,
      editJson,
      this.headerOption
    );
  }

  getAllDaywise(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getAllDaywise?mentorid=${data.id}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }
  getallprogramDetails(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getwholeProgramdetail?&mentorid=${data.mentorid}&program_id=${data.program_id}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }

  deleteDaywise(id: any) {
    return this.http.put(
      this.url + `/mentorship/getAllDaywise`,
      id,
      this.headerOption
    );
  }

  getprogramDropdown(mentorid: any) {
    return this.http.get(
      this.url + `/mentorship/getallProgramDropdown?mentorid=${mentorid}`,
      this.headerOption
    );
  }
  cancelSession(_id: any) {
    let id = { _id: _id };
    return this.http.put(
      this.url + `/mentorship/deleteDayWise`,
      id,
      this.headerOption
    );
  }
  deleteSession(_id: any) {
    return this.http.delete(
      this.url + `/mentorship/hardDeleteSession?_id=${_id}`,
      this.headerOption
    );
  }

  getSingleProgram(_id: any) {
    return this.http.get(
      this.url + `/mentorship/getSingleProgram?_id=${_id}`,
      this.headerOption
    );
  }

  cancelProgram(_id: any) {
    let id = { _id: _id };
    return this.http.put(
      this.url + `/mentorship/delete`,
      id,
      this.headerOption
    );
  }

  logoutStatus(_id: any) {
    return this.http.put(
      this.url + `/auth/logoutStatus?_id=${_id}`,
      {},
      this.headerOption
    );
  }
  changePassword(body: any) {
    return this.http.put(
      this.url + `/auth/changePassword`,
      body,
      this.headerOption
    );
  }

  paymentDetails(data: any) {
    return this.http.get(
      this.url +
      `/payment/paymentDetails?mentor_id=${data.mentor_id}&page=${data.page}&filter=${data.filter}&startDate=${data.startDate}&endDate=${data.endDate}`,
      this.headerOption
    );
  }
  getAllresigsterMentees(data: any) {
    return this.http.get(
      this.url +
      `/mentor/getAllresigsterMentees?program_id=${data.program_id}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }

  postOnsocialMedia(addJson: any) {
    return this.http.post(
      this.url + `/mentor/postOnsocialMedia`,
      addJson,
      this.headerOption
    );
  }
  getProgramsForRating(data: any) {
    return this.http.get(
      this.url +
      `/mentee/getProgramsForRating?mentor_id=${data.mentor_id}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }

  createMentorAccount(data: any) {
    return this.http.post(
      this.url + `/payment/createBankDetails`,
      data,
      this.headerOption
    );
  }

  getAccountDetails() {
    return this.http.get(
      this.url + `/payment/getAccountDetails`,
      this.headerOption
    );
  }
  raiseDispute(formdata: any) {
    return this.http.post(
      this.url + `/mentor/raiseDispute`,
      formdata,
      this.headerOption
    );
  }
  listofDisputes(data: any) {
    return this.http.get(
      this.url +
      `/mentor/listofDisputes?userId=${data.userId}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }
  getallDisputList(data: any) {
    return this.http.get(
      this.url +
      `/mentor/allDisputeList?startDate=${data.startDate}&endDate=${data.endDate}`,
      this.headerOption
    );
  }
  replyonDispute(body: any) {
    return this.http.put(
      this.url + `/mentor/replyonDispute`,
      body,
      this.headerOption
    );
  }
  adminReplyOnDispute(body: any) {
    return this.http.put(
      this.url + `/mentor/adminReplyonDispute`,
      body,
      this.headerOption
    );
  }
  getrewards(data: any) {
    return this.http.get(
      this.url + `/reward/getrewards?user_id=${data.user_id}&page=${data.page}`,
      this.headerOption
    );
  }
  deleteReward(id: any) {
    return this.http.put(
      this.url + "/reward/deleteReward",
      id,
      this.headerOption
    );
  }
  getLocation(formdata: any) {
    return this.http.get(formdata);
  }

  getStaticPages(body: any) {
    return this.http.post(this.url + `/staticPages/getStaticPages`, body);
  }
  menteeattendance(data: any) {
    return this.http.post(
      this.url + `/mentorship/menteeattendance`,
      data,
      this.headerOption
    );
  }
  mentorAverage(body: any) {
    return this.http.put(
      this.url + `/mentor/updateMentorRating`,
      body,
      this.headerOption
    );
  }
  mentorPaymentDetails(id: any) {
    return this.http.get(
      this.url + `/payment/mentorPaymentDetails?mentor_id=${id}`,
      this.headerOption
    );
  }

  updateMentorRatingCount(body: any) {
    return this.http.put(
      this.url + `/mentor/updateMentorRatingCount`,
      body,
      this.headerOption
    );
  }
  chartApiTotalRevenue(id: any) {
    return this.http.get(
      this.url + `/payment/chartApiTotalRevenue`,
      this.headerOption
    );
  }

  chartSignupMentees(id: any) {
    return this.http.get(this.url + `/payment/chartSignupMentees`, this.headerOption);
  }

  rewardAmount(id: any) {
    return this.http.get(this.url + `/payment/rewardAmount?mentorId=${id}`, this.headerOption);
  }

  rewardAmountForMentee(id: any) {
    return this.http.get(this.url + `/payment/rewardAmountForMentee?menteeId=${id}`, this.headerOption);
  }

  getAttendance(id: any) {
    return this.http.get(this.url + `/mentorship/getAttendance?sessionId=${id}`, this.headerOption);
  }

  allPaymentDetails(data: any) {
    return this.http.get(this.url + `/payment/allPaymentDetails?mentor_id=${data.mentor_id}`, this.headerOption);
  }

  cancellationShowMentor() {
    return this.http.get(this.url + `/mentorship/cancellationShowMentor`, this.headerOption);

  }
  uploadSkillFiles(data: any) {
    return this.http.post(
      this.url + `/mentor/uploadSkillFiles`, data, this.headerOption
    );
  }
}
