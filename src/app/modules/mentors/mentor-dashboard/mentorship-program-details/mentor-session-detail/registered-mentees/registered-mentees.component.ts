import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { MentorServiceService } from 'src/app/Services/mentor/mentor-service.service';
import { WebSocketService } from 'src/app/Services/web-socket.service';
import { AuthorizationToken } from 'src/app/Shared/token';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-registered-mentees',
  templateUrl: './registered-mentees.component.html',
  styleUrls: ['./registered-mentees.component.scss']
})
export class RegisteredMenteesComponent extends AuthorizationToken implements OnInit {
  data1:any
  UserData: any;
  loginError: any;
  errortext: any;
  usersPage: any = 1;
  imgsrc: any = '';
  imagecategory: any = environment.urlBackend;
  senderId: any;
  user_id: any;
  ChatData: any;
  program_id: any;
  constructor(private menteeService: MenteeService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private webSocketService: WebSocketService,
    private mentorService: MentorServiceService,
    private location: Location,
    private router: Router) {
    super();

  }


  ngOnInit(): void {
    this.senderId = this.getLocalStorageID();
    this.route.queryParams.subscribe((val: any) => {
      this.user_id = val.user_id;
      this.program_id=val.program_id;
      this.getChatListemit()

      // this.webSocketService.joinRoom(this.senderId)
    })

    let data = {
      filter: "",
      page: this.usersPage,
      program_id:this.program_id
    };
    this.getAllresigsterMentees(data);
    // this.createChatRoom(this.senderId, this.user_id);


  }
  getAllresigsterMentees(data: any) {
    this.mentorService.getAllresigsterMentees(data).subscribe((res: any) => {
      if (res.status === "Success" && res.messageID === 200) {
        //  this.toastr.success(res.message, res.status,);
        this.UserData = res.data.docs;

      }
    }, (err: any) => {
      let res = err.error
      if (res.status === "Failed" && res.messageID === 409) {
        this.toastr.error(res.message, res.status);
      } else if (res.status === "Failed" && res.messageID === 400) {
        this.toastr.error(res.message[0].msg, res.status);
      }

      else if (res.status === "Failed" && res.messageID === 404) {
        this.toastr.error(res.message, res.status);

      } else {
        this.loginError = true;
        this.errortext = res.message;
        this.toastr.error(res.message, res.status);
      }
    })

  }

  onKeyUpEvent(event: any) {
    let data = {
      filter: event.target.value,
      page: this.usersPage,
      program_id:this.program_id
    };
    this.getAllresigsterMentees(data);
  }

  pageChange(page: any) {

    let data = {
      filter: "",
      page: page,
      program_id:this.program_id
    };
    this.getAllresigsterMentees(data);
  }

  createChatRoom(senderId: any, user_id: any) {

    const data = { senderId: senderId, user_id: user_id };

    this.webSocketService.accessChat(data);

    this.webSocketService.receivedCreatedRoom().subscribe((res: any) => {
      this.ChatData = res?.data;

      this.router.navigate([`/mentor/mentor-dashboard/chat/${this.ChatData._id}`]);
    })

  }


  getChatListemit() {
    try {
      this.webSocketService.receiveChatList(this.senderId)

    } catch (err) {
    }
  }
  back(){
    this.location.back();
  }
}
