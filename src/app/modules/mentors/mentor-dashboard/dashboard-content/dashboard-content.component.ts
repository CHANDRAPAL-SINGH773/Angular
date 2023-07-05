import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { AuthorizationToken } from "src/app/Shared/token";
import * as moment from "moment";
import { EventInput } from "@fullcalendar/core";
import { environment } from "src/environments/environment";

import { ChartData, ChartOptions } from "chart.js";

import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
} from "@fullcalendar/core";
import { createEventId } from "../../../../Shared/event-utils";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { ActivatedRoute } from "@angular/router";
import { MenteeService } from "src/app/Services/mentee/mentee.service";

@Component({
  selector: "app-dashboard-content",
  templateUrl: "./dashboard-content.component.html",
  styleUrls: ["./dashboard-content.component.scss"],
})
export class DashboardContentComponent
  extends AuthorizationToken
  implements OnInit {
  loginError: any;
  errortext: any;
  id: any;
  session_page: any = 1;
  usersPage: any = 1;
  allDataInfo: any = [];
  totaldocs: any;
  offlinData: any;
  onlineData: any;
  AllData: any;
  loadData: boolean = false;
  mode: any;
  today = new Date().toISOString().split("T")[0];
  upcomingSessionCount: number = 0;
  pastSessionCount: number = 0;
  currentSessionCount: number = 0;
  filter = "";
  menteeCounts: any = [];
  showImage: any = environment.urlBackend;
  sessionImage: any;
  totalRegisterMentee: any;
  INITIAL_EVENTS: EventInput[] = [];
  dataChart = [];

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "dayGridMonth",
    initialEvents: this.INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];
  past: any;
  current: any;
  oneUserData: any;
  UserData: any;
  program_id: any;
  user_id: any;
  currentSession: any;
  currentSessions: any = [];
  sessions: any = [];
  mentee: any = [];
  menteesId: any;

  salesData: ChartData<'line'> = {
    // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'june', 'july', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      // { label: 'Data', data: [], tension: 0.5 },
      // { label: 'Laptop', data: [200, 100, 400, 50, 90], tension: 0.5 },
      // { label: 'AC', data: [500, 400, 350, 450, 650], tension: 0.5 },
      // { label: 'Headset', data: [1200, 1500, 1020, 1600, 900], tension: 0.5 },
    ],
  };

  salesData1: ChartData<'pie'> = {
    // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Mobiles', data: [1000, 1200] },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: 'Monthly Sales Data',
      },
    },
    scales: {

      y: {

        stacked: true,
        beginAtZero: true,
        max: 100,
        position: 'left',
        ticks: {
          stepSize: 20,
        },
      },
      x: {
        stacked: true,
      }
    },
  };

  chartOptionsPie: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: 'Monthly Sales Data',
      },

    },
  };
  pieData: any;
  signUpMentees: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private menteeservice: MenteeService
  ) {
    super();
    this.id = this.getLocalStorageID();
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      id: this.id,
      page: this.session_page,
    };
    this.getAllDaywise(data);
    // this.INITIAL_EVENTSs();
    this.route.queryParams.subscribe((val: any) => {
      this.user_id = val.user_id;
      this.program_id = val.program_id;
      
  
    });
    this.getAllMenteesList();
    this.chartApiTotalRevenue();
    this.chartSignupMentees();
   
    // let datas = {
    //   filter: "",
    //   page: this.usersPage,
    //   program_id:this.program_id
    // };
    // this.token = localStorage.getItem("token");
    // let dataToken = JSON.parse((this.token) || '{}');
    // this.id = dataToken.data._id;
  }

  // INITIAL_EVENTSs() {
  //   let data = {
  //     filter: "",
  //     id: this.id,
  //     page: this.session_page,
  //   };
  //   // this.mentorservice.getAllresigsterMentees(data).subscribe((res: any) => {
  //   //   if (res.status === "Success" && res.messageID === 200) {
  //   //     for (let event of res.data.docs) {
  //   //       let moment_date = moment(event.start_date).format("YYYY-MM-DD");
  //   //       let timetest = moment_date + "T" + event.time;

  //   //       this.INITIAL_EVENTS.push({
  //   //         id: createEventId(),
  //   //         title: event.session_name,
  //   //         start: timetest,
  //   //         _id: event._id,
  //   //         time: event.time,
  //   //         mode: event.session_data.mentorship_mode,
  //   //       });
  //   //     }
  //   //   }
  //   // });
  // }

  getAllDaywise(data: any) {
    this.allDataInfo = [];
    this.offlinData = [];
    this.onlineData = [];
    let currentDate = new Date();
    let currentSessionCount = 0;
    let pastSessionCount = 0;

    let upcomingSessionCount = 0;
    this.mentorservice.getAllDaywise(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.AllData = res.data.docs;
          console.log(this.AllData,"this.AllData")
          this.AllData.forEach((session: any) => {
            let startDate = new Date(session.session_data.start_date);
            let expiryDate = new Date(session.session_data.expiry_date);
            if (expiryDate < currentDate) {
              pastSessionCount++;
            } else if (startDate > currentDate) {
              upcomingSessionCount++;
            } else {
              currentSessionCount++;
            }
          });

          this.currentSession = this.AllData.filter((session: any) => {
            const expiryDate = new Date(session.session_data.expiry_date);
            const startDate = new Date(session.session_data.start_date);

            // Include the session if the current date is between the start and expiry dates
            return currentDate >= startDate && currentDate <= expiryDate;
          });

          console.log(this.currentSession, "nnnnn");

          // this.currentSession = this.AllData.map((session: any) => {
          //   return session;
          // });
          // this.sessionImage = this.showImage + this.currentSession[0].image;

          // console.log(
          //   "🚀 ~ file: dashboard-content.component.ts:175 ~ getAllDaywise ~ this.sessionImage:",
          //   this.sessionImage
          // );

          this.currentSessionCount = currentSessionCount;
          this.pastSessionCount = pastSessionCount;
          this.upcomingSessionCount = upcomingSessionCount;

          this.loadData = true;
        }
      },
      (err: any) => {
        let res = err?.error;
        if (res?.status === "Failed" && res?.messageID === 409) {
          this.toastr.error(res?.message, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 400) {
          this.toastr.error(res?.message[0].msg, res?.status);
        } else if (res?.status === "Failed" && res?.messageID === 404) {
          // this.toastr.error(res?.message, res?.status);
        } else {
          this.loginError = true;
          this.errortext = res?.message;
          this.toastr.error(res?.message, res?.status);
        }
      }
    );
  }


  pageChange(page: any) {
    let data = {
      filter: "",
      id: this.id,
      page: this.session_page,
    };
    this.session_page = page;
    this.getAllDaywise(data);

  }

  getAllMenteesList() {
    this.menteeservice.getAllMenteeList(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.UserData = res.count;
          this.loadData=true
          console.log(this.UserData, " this.UserData");
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          this.toastr.error(res.message, res.status);
        } else if (res.status === "Failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else if (res.status === "Failed" && res.messageID === 404) {
          // this.toastr.error(res.message, res.status);
        } else {
          this.loginError = true;
          this.errortext = res.message;
          // this.toastr.error(res.message, res.status);
        }
      }
    );
  }

  chartApiTotalRevenue() {
    this.mentorservice.chartApiTotalRevenue(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.pieData = res.data;
          // console.log(this., " this.UserData");
          let data = [this.pieData.revenueDetails.onlineTotal, this.pieData.revenueDetails.offlineTotal]
          this.salesData1 = {
            datasets: [
              { label: 'Mobiles', data: data },
            ],
          };
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          this.toastr.error(res.message, res.status);
        } else if (res.status === "Failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else if (res.status === "Failed" && res.messageID === 404) {
          this.toastr.error(res.message, res.status);
        } else {
          this.loginError = true;
          this.errortext = res.message;
          this.toastr.error(res.message, res.status);
        }
      }
    );
  }


  chartSignupMentees() {
    this.mentorservice.chartSignupMentees(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.signUpMentees = res.data;
          let data = [this.pieData.revenueDetails.onlineTotal, this.pieData.revenueDetails.offlineTotal]
          this.salesData = {
            datasets: [
              { label: 'Data', data: this.signUpMentees },
              // { label: 'Laptop', data: [200, 100, 400, 50, 90], tension: 0.5 },
              // { label: 'AC', data: [500, 400, 350, 450, 650], tension: 0.5 },
              // { label: 'Headset', data: [1200, 1500, 1020, 1600, 900], tension: 0.5 },
            ],
          };

          this.dataChart = Object.values(this.signUpMentees)
          // console.log(dataChart, "maxValuemaxValuemaxValue",);
          const maxValue = Math.max(...this.dataChart);
          console.log(maxValue, "maxValuemaxValuemaxValue",);

          this.chartOptions = {
            responsive: true,
            plugins: {
              title: {
                display: true,
                // text: 'Monthly Sales Data',
              },
            },
            scales: {

              y: {

                stacked: true,
                beginAtZero: true,
                max: maxValue,
                position: 'left',
                ticks: {
                  stepSize: 20,
                },
              },
              x: {
                stacked: true,
              }
            },
          }
        }
      },
      (err: any) => {
        let res = err.error;
        if (res.status === "Failed" && res.messageID === 409) {
          this.toastr.error(res.message, res.status);
        } else if (res.status === "Failed" && res.messageID === 400) {
          this.toastr.error(res.message[0].msg, res.status);
        } else if (res.status === "Failed" && res.messageID === 404) {
          this.toastr.error(res.message, res.status);
        } else {
          this.loginError = true;
          this.errortext = res.message;
          this.toastr.error(res.message, res.status);
        }
      }
    );
  }

  convertTimeFormat(time: string): string {
    const parts = time.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1] || '00'; // Set minutes to '00' if not provided
  
    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
  
    // Add leading zero for single-digit hours
    const formattedHoursString = formattedHours < 10 ? '0' + formattedHours : formattedHours.toString();
  
    return formattedHoursString + ':' + minutes + ' ' + period;
  }
}

