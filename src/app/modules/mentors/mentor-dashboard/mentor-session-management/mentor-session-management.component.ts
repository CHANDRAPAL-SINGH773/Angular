import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from 'src/app/Services/admin/admin.service';
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from 'src/app/Shared/token';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from "@fullcalendar/core";
import { createEventId } from '../../../../Shared/event-utils';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import * as  moment from 'moment';
import Swal from 'sweetalert2';
@Component({
  selector: "app-mentor-session-management",
  templateUrl: "./mentor-session-management.component.html",
  styleUrls: ["./mentor-session-management.component.scss"],
})
export class MentorSessionManagementComponent extends AuthorizationToken implements OnInit {
  onlineData1: any;
  offlinData1: any;
  OfflinEvents: EventInput[] = [];
  calenderData: any = [];
  calendermode: any;
  convertedTime:any
  

  ids: string = "list";
  loginError: any;
  errortext: any;
  session_page: any = 1;
  id: any;
  count: any;
  AllData: any=[];
  showImage: any = environment.urlBackend;
  deleteData: any;
  calendarId: any = '';
  oneSessionDetail: any;
  today = new Date().toISOString().split('T')[0];
  showList: boolean = false;
  allDataInfo: any = []
  mode: any;
  offlinData: any;
  onlineData:any;
  loadData: boolean =false;
  state: string = 'online';

  changeTab(ids: string) {
    this.ids = ids;
  }
  changeState(state: string) {
    this.state= state;
    }

  INITIAL_EVENTS: EventInput[] = [];

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
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mentorservice: MentorServiceService,
    private adminService: AdminService,
    private changeDetector: ChangeDetectorRef) {
    super();
    this.id = this.getLocalStorageID();
    // this.convertedTime = convertTimeFormat()
  }

  ngOnInit(): void {
    let data = {
      filter: "",
      id: this.id,
      page: this.session_page,
    };
    this.getAllDaywise(data);
    this.INITIAL_EVENTSs();

  }

  INITIAL_EVENTSs() {
    let data = {
      filter: "",
      id: this.id,
      page: this.session_page,
    };
    this.mentorservice.getAllDaywise(data).subscribe((res: any) => {

      if (res.status === "Success" && res.messageID === 200) {
        this.calenderData = res.data.docs;
        this.onlineData1 = [];
        this.offlinData1 = [];
        this.AllData.filter((el: any) => {
          this.calendermode  = el.session_data.mentorship_mode 

          if ( this.calendermode === 0) {
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

      let moment_date = moment(event.start_date).format("YYYY-MM-DD");
      let timetest = moment_date + "T" + event.time;

      this.OfflinEvents.push({

        id: createEventId(),
        title: event.session_name,
            start: timetest,
            _id: event._id,
            time: event.time,
            mode:event.session_data.mentorship_mode
      });


    }
  }
  onlineFunction() {
    for (let eventOnline of this.onlineData1) {

      let moment_date = moment(eventOnline.start_date).format("YYYY-MM-DD");
      let timetest = moment_date + "T" + eventOnline.time;

      this.INITIAL_EVENTS.push({

        id: createEventId(),
          title: eventOnline.session_name,
            start: timetest,
            _id: eventOnline._id,
            time: eventOnline.time,
            mode:eventOnline.session_data.mentorship_mode
      });


    }

  }

  getAllDaywise(data: any) {
    this.allDataInfo = []
    this.offlinData = []
    this.onlineData = []
    this.mentorservice.getAllDaywise(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
      
        this.AllData = res.data.docs;
       
        this.loadData=true
        this.AllData.filter((el: any) => {
          this.mode = el.session_data.mentorship_mode 

          if (this.mode===0) {
            this.offlinData.push(el)
            console.log(  this.offlinData,"  this.offlinData");
            
          }

         if (this.mode===1) {
            this.onlineData.push(el)
            console.log(  this.onlineData,"  this.onlineData");
            
          }


        })
      }
    }, (err: any) => {
      let res = err?.error;
      if (res?.status === "Failed" && res?.messageID === 409) {
        this.toastr.error(res?.message, res?.status);
      } else if (res?.status === "Failed" && res?.messageID === 400) {
        this.toastr.error(res?.message[0].msg, res?.status);
      }

      else if (res?.status === "Failed" && res?.messageID === 404) {
        this.toastr.error(res?.message, res?.status);

      } else {
        this.loginError = true;
        this.errortext = res?.message;
        this.toastr.error(res?.message, res?.status);
      }
    })
  }


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.router.navigate(["/mentor/mentor-dashboard/add-session"],
      { queryParams: { from: selectInfo.startStr }, });
  }

  handleEventClick(clickInfo: EventClickArg) {

    console.log("clickInfo",clickInfo);
    
    this.calendarId = clickInfo.event?._def.extendedProps['_id'];
    let mode =clickInfo.event?._def.extendedProps['mode']  
   this.router.navigate(['/mentor/mentor-dashboard/session'], {
     queryParams: { user_id:this.calendarId,mode:mode},
   })

    // this.calendarId = clickInfo.event?._def.extendedProps['_id'];
    // this.deletesession(this.calendarId)
  }

  deletesession(calendarId: any) {
  }

  deleteData1(calendarId: any) {
    this.mentorservice.deleteDaywise({ _id: calendarId }).subscribe((res: any) => {
    }
    );

  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      id: this.id,
      page: this.session_page,

      // page: this.category_page,
    };
    this.getAllDaywise(data)
  }
  closemodal() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/mentor/mentor-dashboard/session-management"]);
    });
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
