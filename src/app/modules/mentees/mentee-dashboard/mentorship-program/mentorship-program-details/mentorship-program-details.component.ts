import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { environment } from 'src/environments/environment';
import { AuthorizationToken } from 'src/app/Shared/token';
import { ToastrService } from "ngx-toastr";
import { MentorServiceService } from "src/app/Services/mentor/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from "@fullcalendar/core";
import { createEventId, INITIAL_EVENTS } from 'src/app/Shared/event-utils';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { WebSocketService } from "src/app/Services/web-socket.service";



@Component({
  selector: "app-mentorship-program-details",
  templateUrl: "./mentorship-program-details.component.html",
  styleUrls: ["./mentorship-program-details.component.scss"],
})
export class MentorshipProgramDetailsComponent extends AuthorizationToken implements OnInit {
  ids: string = "program";
  programid: any;
  loginError: any;
  errortext: any;
  allData: any;
  detailPage: any = 1;
  user_id: any;
  showImage: any = environment.urlBackend;
  imagedata: any;
  sessiondetails: any;
  totaldocs: any;

  data1: any = [];
  showHeading: any;
  singleData: any = [];
  id: any;
  startTime: any;
  aboutMentor: boolean = false;
  session_page: any;

  INITIAL_EVENTS: EventInput[] = [];

  calendarVisible = true;
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
  calendarId: any;
  allProgramData: any;
  catName: any;
  idforback: any;
  registerMetees: number = 0;
  availableSlots: number = 0;
  programName: any;
  constructor(private mentorservice: MentorServiceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private webSocketservice: WebSocketService,) {

    super()
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.programid = val.program_id;
      this.showHeading = val.category;
      this.id = val.id;
      this.idforback = val.idforback
      this.catName = val.catid;

    });

    let data = {
      filter: "",
      program_id: this.programid,
      mentorid: this.id,
      page: this.detailPage,
    };
    this.getallDetails(data);
    this.getSingleProgram();
    this.INITIAL_EVENTSs();
  }


  INITIAL_EVENTSs() {
    let data = {
      filter: "",
      program_id: this.programid,
      mentorid: this.id,
      page: this.detailPage,
    };
    this.mentorservice.getallprogramDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.allProgramData = res.data.docs;


        for (let event of res.data.docs) {

          let moment_date = moment(event.start_date).format("YYYY-MM-DD");
          let timetest = moment_date + "T" + event.time;

          this.INITIAL_EVENTS.push({
            id: createEventId(),
            title: event.session_name,
            start: timetest,
            _id: event._id,
            // _id: event._id,
            time: event.time,

          });
        }
      }
    })


  }


  getallDetails(data: any) {
    this.mentorservice.getallprogramDetails(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.allData = res.data.docs;
        this.totaldocs = res.data.totalDocs;
        this.startTime = this.allData[0].time
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

  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
      program_id: this.programid,
      mentorid: this.id,
      // roles: this.roles,
    };
    this.detailPage = page;
    this.getallDetails(data);
  }

  getSingleProgram() {
    this.mentorservice.getSingleProgram(this.programid).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        this.singleData = res.data;
        this.registerMetees = res.registerMentee;
        this.availableSlots = (this.singleData.mentee_limit - this.registerMetees)
        console.log("TCL: MentorshipProgramDetailsComponent -> getSingleProgram ->  this.singleData", this.singleData)

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
  changeTab(ids: string) {
    this.ids = ids;
  }


  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.calendarId = clickInfo.event?._def.extendedProps['_id'];
    this.deletesession(this.calendarId)
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



  createGroupFuntion() {
    // console.log(this.programImage, "getSingleProgramgetSingleProgram");
    let userArray: any = [];
    userArray.push({
      userId: this.user_id,
      status: 1,
    });
    this.mentorservice
      .getSingleProgram(this.programid)
      .subscribe((res: any) => {
        console.log("cgec", res);
        if (res.status === "Success" && res.messageID === 200) {
          this.singleData = res.data;
          if (
            this.singleData.RegisterMentee &&
            this.singleData.RegisterMentee.length > 0
          ) {
            this.singleData.RegisterMentee.map((e1: any) => {
              userArray.push({ userId: e1.user_id, status: 1 });
            });
            console.log(userArray, "A");
          }

          this.registerMetees = res.registerMentee;

          this.programName = this.singleData.mentorship_name;
          console.log(this.programName, "this.programName");

          let data = {
            chatName: this.programName,
            chatImage: "this.programImage,,",
            users: userArray,
            
            isGroupChat: true,
            groupAdmin: this.user_id,
            groupDetails: {
              name: this.programName,
              image: "this.programImage",
            },
            identificationID: this.user_id,
            program_id: this.programid,
            role: 2,
            menteeId:this.user_id
          };
          console.log(data, "data dekho");

          this.webSocketservice.createGroup(data);
        }
      });

    // Declare a flag variable to track toastr display
    let toastrDisplayed = false;

    this.webSocketservice.accessGroupInfo().subscribe((res: any) => {
      if (res.messageID == 400) {
        if (!toastrDisplayed) {
          this.toastr.error(res.message);
          toastrDisplayed = true; // Set the flag to true after displaying toastr
        }
      } else {
        this.router.navigate([
          `/mentor/mentor-dashboard/chat/${res?.data?._id}`,
        ]);
      }
    });
  }

}
