import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MenteeService extends AuthorizationToken {
  clicked = new Subject<boolean>();
  constructor(private http: HttpClient) {
    super();
    this.headerOption = this.gettoken();
  }
  url = environment.apiUrl;
  headerOption: any;

  signUpMentee(body: any) {
    return this.http.post(this.url + "/mentor/register", body, {});
  }

  allMentor(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(
      this.url +
      `/mentor/getAll-users?filter=${data.filter}&page=${data.page}&roles=mentor`,
      headerOption
    );
  }

  registorMentees(data: any) {
    let headerOption = this.gettoken();
    return this.http.get(
      this.url +
      `/mentor/getAll-users?filter=${data.filter}&page=${data.page}&roles=mentee`,
      headerOption
    );
  }

  getChatMessage(chatId: any) {
    return this.http.get(
      this.url + `/mentee/get-message-web?chatId=${chatId.chatId}&type=web`,
      this.headerOption
    );
  }

  formatDate(date: string) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date(date);
    const today = new Date();
    let timeeDifference = today.getTime() - d.getTime();
    let daysDiff: any = timeeDifference / (1000 * 60 * 60 * 24);
    daysDiff = parseInt(daysDiff);
    if (daysDiff <= 7) {
      return `${days[d.getDay()]}, ${this.formatNumber(
        d.getHours()
      )}:${this.formatNumber(d.getMinutes())}`;
    }
    return `${d.getDate()} ${monthNames[d.getMonth()]
      } ${d.getFullYear()}, ${this.formatNumber(
        d.getHours()
      )}:${this.formatNumber(d.getMinutes())}`;
  }

  formatNumber(number: number) {
    return number <= 9 ? "0" + number : number;
  }
  getAllMentee(data: any) {
    return this.http.get(
      this.url + `/mentor/getAllMentee?filter=${data}`,
      this.headerOption
    );
  }
  createGroup(fields: any) {
    return this.http.post(
      this.url + "/mentor/createGroup",
      fields,
      this.headerOption
    );
  }
  menteeTrendingProgram(data: any) {
    return this.http.get(
      this.url +
      `/mentee/menteeTrendingProgram?filter=${data.filter}&page=${data.page}`,
      this.headerOption
    );
  }

  programAndMentorDetail(programid: any) {
    return this.http.get(
      this.url + `/mentee/programAndMentorDetail?programid=${programid}`,
      this.headerOption
    );
  }

  getwholeProgramdetail(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getwholeProgramdetail?filter=${data.filter}&page=${data.page}&mentorid=${data.mentorid}&program_id=${data.program_id}`,
      this.headerOption
    );
  }
  bookProgram(body: any) {
    return this.http.post(
      this.url + "/payment/bookProgram",
      body,
      this.headerOption
    );
  }

  uploadMessageImage(data: any) {
    return this.http.post(this.url + "upload-message-image", data);
  }

  getmeenteeinGroup(_id: any) {
    return this.http.get(
      this.url + `/payment/getmeenteeinGroup?_id=${_id}`,
      this.headerOption
    );
  }
  getAllUsers() {
    return this.http.get(this.url + `/payment/getAllUsers`, this.headerOption);
  }

  getNotification() {
    return this.http.get(
      this.url + `/mentee/get-notifications`,
      this.headerOption
    );
  }

  getNotificationForReciver() {
    return this.http.get(
      this.url + `/mentee/getNotificationForReciver`,
      this.headerOption
    );
  }

  updateNotification(body: any) {
    return this.http.put(
      this.url + "/mentee/updateNotification",
      body,
      this.headerOption
    );
  }
  clearAllNotifications(body: any) {
    return this.http.put(
      this.url + "/mentee/clearAllNotifications",
      body,
      this.headerOption
    );
  }

  blockUser(updateJson: any) {
    return this.http.put(
      this.url + `/mentee/blockUser`,
      updateJson,
      this.headerOption
    );
  }
  getAllDaywiseForMentee(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/getAllDaywiseForMentee?user_id=${data.user_id}&filter=${data.filter}&page=${data.page}&sessionType=${data.sessionType}`,
      this.headerOption
    );
  }
  pastgetAllDaywiseForMentee(data: any) {
    return this.http.get(
      this.url +
      `/mentorship/pastgetAllDaywiseForMentee?user_id=${data.user_id}&filter=${data.filter}&page=${data.page}`,
      this.headerOption
    );
  }
  createPayment(body: any) {
    return this.http.post(
      this.url + "/payment/createPayment",
      body,
      this.headerOption
    );
  }

  makeTip(body: any) {
    return this.http.post(
      this.url + "/payment/makeTip",
      body,
      this.headerOption
    );
  }
  getRating(data: any) {
    return this.http.get(
      this.url + `/mentee/getRating?program_id=${data.program_id}`,
      this.headerOption
    );
  }

  getCardDetails(id: any) {
    return this.http.get(
      this.url + `/payment/getCardDetails?id=${id}`,
      this.headerOption
    );
  }
  ratingReview(body: any) {
    return this.http.post(
      this.url + "/mentee/ratingReview",
      body,
      this.headerOption
    );
  }
  replyonComment(body: any) {
    return this.http.put(
      this.url + "/mentee/replyonComment",
      body,
      this.headerOption
    );
  }

  markNotificationClicked(data: any) {
    return this.http.put(this.url + "update-notification", data);
  }

  createNewMentorshipProgram(body: any) {
    return this.http.post(
      this.url + "/mentee/createNewMentorshipProgram",
      body,
      this.headerOption
    );
  }
  getuserAndSession(sessionId: any) {
    return this.http.get(
      this.url + `/mentor/getuserAndSession?sessionId=${sessionId}`,
      this.headerOption
    );
  }
  helpSupport(mailbody: any) {
    return this.http.post(
      this.url + "/auth/helpSupport",
      mailbody,
      this.headerOption
    );
  }
  shareLocation(mailbody: any){
    return this.http.post(
      this.url + "/auth/shareLocation",
      mailbody,
      this.headerOption
    );
  }
  getpurchasedPrograms(data: any) {
    return this.http.get(
      this.url +
      `/mentee/getpurchasedPrograms?user_Id=${data.user_Id}&page=${data.page}&filter=${data.filter}`,
      this.headerOption
    );
  }
  getAdmin() {
    return this.http.get(this.url + `/mentee/getAdmin`, this.headerOption);
  }
  getrewards(data: any) {
    return this.http.get(
      this.url + `/reward/getrewards?user_id=${data.user_id}&page=${data.page}`,
      this.headerOption
    );
  }

  getAllNewMentorshipProgram(data: any) {
    return this.http.get(
      this.url +
      `/mentee/getAllNewMentorshipProgram?filter=${data.filter}&page=${data.page}`,
      this.headerOption
    );
  }

  cancelMeeting(body: any) {
    return this.http.post(
      this.url + "/mentee/cancelMeeting",
      body,
      this.headerOption
    );
  }
  showreferalCode(user_id: any) {
    return this.http.get(
      this.url + `/reward/showreferalCode?user_id=${user_id}`,
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
  getMarkers(pid: any, sid: any) {
    return this.http.get(
      this.url +
      "/mentorship/getSessionUsers?programId=" +
      pid +
      "&session_id=" +
      sid
    );
  }

  getAllMenteeList(menteeId: any) {
    return this.http.get(
      this.url + `/mentee/getAllMenteeCount?menteeId=${menteeId}`,
      this.headerOption
    );
  }

  addCard(body: any) {
    return this.http.post(
      this.url + "/payment/addCard",
      body,
      this.headerOption
    );
  }

  deleteCard(body: any) {
    return this.http.post(
      this.url + "/payment/deleteCard",
      body,
      this.headerOption
    );
  }


  programAndMentorDetailTotalcount(user_id: any) {
    return this.http.get(this.url + `/mentee/programAndMentorDetailTotalcount?user_id=${user_id}`, this.headerOption
    );
  }

  globalSearch(filter:any){
    return this.http.get(this.url + `/mentor/global-search?filter=${filter}`, this.headerOption);
  }
}
