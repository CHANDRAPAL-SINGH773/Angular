import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
} from "@fullcalendar/core";
import { ActivatedRoute, Router } from "@angular/router";
import { createEventId } from 'src/app/Shared/event-utils';
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { environment } from "src/environments/environment";
import { AuthorizationToken } from "src/app/Shared/token";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import * as  moment from 'moment';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: "app-session-management",
  templateUrl: "./session-management.component.html",
  styleUrls: ["./session-management.component.scss"],
})
export class SessionManagementComponent extends AuthorizationToken implements OnInit {
  totaldocs: any = 0;
  ids: string = "list";
  ids2: string = "online";
  allDataInfo: any = [];
  AllData: any = [];
  calenderData: any = [];
  today = new Date().toISOString().split("T")[0];
  loginError: any;
  errortext: any;
  session_page: any = 1;
  showImage: any = environment.urlBackend;
  id: any;
  offlinData: any;
  loadData: boolean = false;
  mode: any;
  calendermode: any;
  onlineData: any;
  onlineData1: any;
  offlinData1: any;
  state: string = 'online';
  INITIAL_EVENTS: EventInput[] = [];
  OfflinEvents: EventInput[] = [];
  calendarId: any = '';
  constructor(private changeDetector: ChangeDetectorRef,
    private mentorservice: MentorServiceService,
    private router: Router,
    private menteeservice: MenteeService,
    private toastr: ToastrService,) {
    super();
    this.id = this.getLocalStorageID();
  }
  changeTab(ids: string) {
    this.ids = ids;
  }
  changeStatus(ids2: string) {
    this.ids2 = ids2;
  }
  ngOnInit(): void {
    let data = {
      filter: "",
      user_id: this.id,
      page: this.session_page,
      sessionType:this.state
    };
    this.getAllDaywiseForMentee(data);
    // this.INITIAL_EVENTSs();
  }

  calendarVisible = true;
  calendarOptionsOffline: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "dayGridMonth",
    initialEvents: this.OfflinEvents, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  currentEventsOffline: EventApi[] = [];
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt("Please enter a new title for your event");
  //   const calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay,
  //     });
  //   }
  // }
  handleDateSelect(selectInfo: DateSelectArg) {
    // this.router.navigate(["/mentor/mentor-dashboard/add-session"],
    //   { queryParams: { from: selectInfo.startStr }, });
  }


  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo, "clickInfo");

    this.calendarId = clickInfo.event?._def.extendedProps['_id'];
    let mode = clickInfo.event?._def.extendedProps['mode']
    this.router.navigate(['/mentee/mentee-dashboard/added-sessions'], {
      queryParams: { session_id: this.calendarId, mode: mode },
    })
    // this.calendarId = clickInfo.event?._def.extendedProps['_id'];
    // this.deletesession(this.calendarId)
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }



  changeState(state: string) {
    this.state = state;
    this.session_page=1;
    let data = {
      filter: "",
      user_id: this.id,
      page: this.session_page,
      sessionType:this.state
    };
    console.log("changeState",data)
    this.getAllDaywiseForMentee(data);
  }
  getAllDaywiseForMentee(data: any) {
    data.sessionTyp=this.state
// console.log("dataaaaa",data,this.state)
    this.menteeservice.getAllDaywiseForMentee(data).subscribe(
      (res: any) => {
        this.allDataInfo = [];
        this.offlinData = [];
        this.onlineData = [];
        if (res.status === "Success" && res.messageID === 200) {
          this.AllData = res.data.docs;
          this.totaldocs=res.data.totalDocs
          console.log("this.AllData",this.AllData,this.totaldocs)
          this.loadData = true
          this.AllData.filter((el: any) => {
            this.mode = el.mentorship_mode


            if (this.mode === 0) {
              this.offlinData.push(el)

            }

            if (this.mode === 1) {
              this.onlineData.push(el)


            }


          })
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



  INITIAL_EVENTSs() {
    let data = {
      filter: "",
      user_id: this.id,
      page: this.session_page,
    };
    this.menteeservice.getAllDaywiseForMentee(data).subscribe((res: any) => {

      if (res.status === "Success" && res.messageID === 200) {
        this.calenderData = res.data.docs;
        this.onlineData1 = [];
        this.offlinData1 = [];
        this.AllData.filter((el: any) => {
          this.calendermode = el.mentorship_mode
          console.log(this.calendermode, "mode");

          if (this.calendermode === 0) {
            this.offlinData1.push(el)

          }

          if (this.calendermode === 1) {
            this.onlineData1.push(el)


          }


        })
        this.offlineFunction()
        this.onlineFunction()


      }
    })


  }
  offlineFunction() {
    // this.OfflinEvents = []
    for (let event of this.offlinData1) {
      console.log(this.offlinData1, "gggksdlfskjd");


      let moment_date = moment(event.start_date).format("YYYY-MM-DD");
      let timetest = moment_date + "T" + event.time;

      this.OfflinEvents.push({

        id: createEventId(),
        title: event.sessionName,
        start: timetest,
        _id: event.sessionId,
        time: event.time,
        mode: event.mentorship_mode
      });

      console.log(this.OfflinEvents, " this.OfflinEvents");


    }
  }
  onlineFunction() {
    for (let eventOnline of this.onlineData1) {
      console.log(eventOnline, "PPPP", this.onlineData1);

      let moment_date = moment(eventOnline.start_date).format("YYYY-MM-DD");
      let timetest = moment_date + "T" + eventOnline.time;

      this.INITIAL_EVENTS.push({

        id: createEventId(),
        title: eventOnline.sessionName,
        start: timetest,
        _id: eventOnline.sessionId,
        time: eventOnline.time,
        mode: eventOnline.mentorship_mode
      });


    }

  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      user_id: this.id,
      page: this.session_page,

    };
    this.getAllDaywiseForMentee(data);
  }

  deletesession(calendarId: any) {
  }

  deleteData1(calendarId: any) {
    this.mentorservice.deleteDaywise({ _id: calendarId }).subscribe((res: any) => {
    }
    );

  }
  pageChange(page: any) {

    let data = {
      filter: "",
      user_id: this.id,
      page: page,
    };
    this.session_page = page;
    this.getAllDaywiseForMentee(data);
  }
  // gotoMentorDetail(){
  //   this.router.navigate(['mentee/mentee-dashboard/mentors-details'])
  // }
}
