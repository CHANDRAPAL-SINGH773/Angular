import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthorizationToken } from "src/app/Shared/token";
import { WebSocketService } from "src/app/Services/web-socket.service";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Console } from "console";

// import { ConditionalExpr } from "@angular/compiler";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent extends AuthorizationToken implements OnInit {
  togglechatList: boolean = true;
  senderId: any;
  allGroupChats: any;
  allGroupChatsData: any;
  baseUrl: any = environment.urlBackend;
  id: any;
  chatId: any;
  showSendOptions: any = Boolean;
  imgsrc: any;
  showImage: any = environment.urlBackend;
  UserData: any;
  loginError: any;
  errortext: any;
  filter = "";
  loggedInUserId: any;

  // name:any;
  // ckeckedUsers:any=[];
  submitted: boolean = false;
  groupchatForm: FormGroup;
  userArray: any = [];
  contactId: any;
  ChatIdModal: any;
  chatNamecheck: any = [];
  loggedInUserRole: any;
  isOnline: any = [];
  unreadCountArray: any = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private webSocketService: WebSocketService,
    private toastr: ToastrService,
    private menteeservice: MenteeService
  ) {
    super();
    this.loggedInUserId = this.getLocalStorageID();
    this.groupchatForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      ckeckedUsers: new FormArray([]),
    });
    this.menteeservice.clicked.subscribe((res: boolean) => {
      this.togglechatList = res;
    });
  }

  ngOnInit(): void {
    this.senderId = this.getLocalStorageID();
    this.webSocketService.joinRoom(this.senderId);
    this.loggedInUserRole = this.getLocalStorageRole();

    this.activatedRoute.params.subscribe((params: any) => {
      this.showSendOptions = false;
    });
    this.webSocketService.joinRoom(this.senderId);
    this.webSocketService.connect();

    this.getChatList("");
  }

  closemodal() {
    // this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
    //   this.router.navigate(["/admin-category-path"]);
    // });
  }

  getChatList(filter: any) {
    let dataToPass: { senderId: any; filter?: any } = {
      senderId: this.senderId,
    };
    if(filter!==""){
    dataToPass.filter=filter
      // console.log("filterValue.target.value",dataToPass)
    }
    this.webSocketService.receiveChatList(dataToPass);
    this.allGroupChats = this.webSocketService
      .userData()
      .subscribe((res: any) => {
        // console.log("gettting response", res);

        this.unreadCountArray = res?.data?.chatCount;
        res.data.chatCount.forEach((element: any) => {
          this.unreadCountArray[element._id] = element.count;
        });

        // console.log(this.unreadCountArray, "this.check");

        this.allGroupChatsData = res.data.result.docs;
        console.log("this.allGroupChatsData",res)
        this.imgsrc = this.showImage + this.allGroupChatsData.image;

        res.data.result.docs.map((el: any) => {
          if (!el.isGroupChat) {
            el.users.forEach((element: any) => {
              if (element._id != this.senderId) {
                el.chatName = element?.firstName;
                if (element.image && element.image != "null") {
                  el.image = this.baseUrl + element.image;
                }
                el.role = element.role;
              }
            });
          } else {
            el.groupDetails.name = el.chatNames;
          }
        });
        this.allGroupChats = res.data.result.docs;
         console.log(this.allGroupChats, "allchats");


        // const onlineUsers = this.allGroupChats.users.filter(user => user.isOnline);
        // console.log(onlineUsers);

        this.allGroupChats.forEach((ele: any) => {
          // console.log(ele, "data record")
          let onlineData;
          ele.users.forEach((el1: any) => {
            // console.log(this.senderId, "senderId check ");

            if (el1._id != this.senderId) {
              onlineData = el1.isOnline;
              // console.log(this.isOnline, "isonliendata")
            }
          });

          this.isOnline.push(onlineData)
        });
      });
  }

  applyFilter(filterValue: any) {
    // console.log("mylog", filterValue.target.value);
    this.getChatList(filterValue.target.value)
    // if (this.selectedTab == 1) {
    // this.allGroupChatsData.filter = filterValue.target.value.trim().toLowerCase();
    // }
    // this.allGroupChatsData = this.allGroupChatsData.filter((chatData: any) => {
    //   const filterText = filterValue.target.value.trim().toLowerCase();
    //   return chatData.chatName;
    // });
    // this.menteeservice.globalSearch(filterValue.target.value).subscribe(
    //   (res: any) => {
    //     if (res.status === "Success" && res.messageID === 200) {
    //       //  this.toastr.success(res.message, res.status,);
    //       // this.UserData = res.data.docs;
    //       // this.patchValues()
    //       // this.UserData=res.data
    //       this.allGroupChatsData=res?.data
    //       let data=res.data
    //       console.log(data,"OOOOOOOOOOOO");

    //     }
    //   },
    //   (err: any) => {
    //     let res = err.error;
    //     if (res.status === "Failed" && res.messageID === 409) {
    //       this.toastr.error(res.message, res.status);
    //     } else if (res.status === "Failed" && res.messageID === 400) {
    //       this.toastr.error(res.message[0].msg, res.status);
    //     } else if (res.status === "Failed" && res.messageID === 404) {
    //       this.toastr.error(res.message, res.status);
    //     } else {
    //       this.loginError = true;
    //       this.errortext = res.message;
    //       this.toastr.error(res.message, res.status);
    //     }
    //   }
    // );



  }




  // formatCHatName(chatName: string) {
  //   if (chatName.length <= 25) {
  //     return chatName;
  //   } else {
  //     let name = chatName.split(', ');
  //     return name[0] + ',.., ' + name[name.length - 1];
  //   }
  // }
  onKeyUpEvent(event: any) {
    // console.log("check log");

    this.filter = event.target.value;
    this.getChatList("");
    // this.menteeservice.getAllMentee(this.filter).subscribe((res: any) => {
    //   if (res.status === "Success" && res.messageID === 200) {
    //     //  this.toastr.success(res.message, res.status,);
    //     this.UserData = res.data.docs;
    //     // this.patchValues()
    //   }
    // })
  }

  onCheckboxChange(event: any) {
    const userschecked = this.groupchatForm.controls[
      "ckeckedUsers"
    ] as FormArray;
    if (event.target.checked) {
      userschecked.push(new FormControl(event.target.value));

      this.userArray.push({ userId: event.target.value, status: 1 });
    } else {
      const index = userschecked.controls.findIndex(
        (x) => x.value === event.target.value
      );
      userschecked.removeAt(index);

      const dataIndex = this.userArray.findIndex(
        (y: any) => y.userId === event.target.value
      );
      this.userArray.splice(dataIndex, 1);
    }
  }

  // submit() {
  //   this.submitted = true
  //   if (!this.groupchatForm.valid) {
  //     this.toastr.error("Error")
  //     return
  //   }
  //   let fields = {
  //     name: this.groupchatForm.get('name')?.value,
  //     ckeckedUsers: this.groupchatForm.get('ckeckedUsers')?.value,
  //   }
  //   console.log(fields, "fields");
  //   this.groupchatForm.reset()
  //   // this.menteeservice.createGroup(fields).subscribe((res: any) => {
  //   //   if (res.status === "Success" && res.messageID === 200) {
  //   //     //  this.toastr.success(res.message, res.status,);
  //   //     this.UserData = res.data.docs;
  //   //     // this.patchValues()
  //   //   }
  //   // }, (err: any) => {
  //   //   let res = err.error
  //   //   if (res.status === "Failed" && res.messageID === 409) {
  //   //     this.toastr.error(res.message, res.status);
  //   //   } else if (res.status === "Failed" && res.messageID === 400) {
  //   //     this.toastr.error(res.message[0].msg, res.status);
  //   //   }
  //   //   else if (res.status === "Failed" && res.messageID === 404) {
  //   //     this.toastr.error(res.message, res.status);
  //   //   } else {
  //   //     this.loginError = true;
  //   //     this.errortext = res.message;
  //   //     this.toastr.error(res.message, res.status);
  //   //   }
  //   // })
  //   this.menteeservice.createGroup(fields).subscribe((res: any) => {
  //     if (res.status === "Success" && res.messageID === 200) {
  //       //  this.toastr.success(res.message, res.status,);
  //       this.UserData = res.data.docs;
  //       // this.patchValues()
  //     }
  //   }, (err: any) => {
  //     let res = err.error
  //     if (res.status === "Failed" && res.messageID === 409) {
  //       this.toastr.error(res.message, res.status);
  //     } else if (res.status === "Failed" && res.messageID === 400) {
  //       this.toastr.error(res.message[0].msg, res.status);
  //     }
  //     else if (res.status === "Failed" && res.messageID === 404) {
  //       this.toastr.error(res.message, res.status);
  //     } else {
  //       this.loginError = true;
  //       this.errortext = res.message;
  //       this.toastr.error(res.message, res.status);
  //     }
  //   })
  // }

  getAllMentee() {
    this.menteeservice.getAllMentee(this.filter).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          //  this.toastr.success(res.message, res.status,);
          this.UserData = res.data.docs;
          // this.patchValues()
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

  submit() {
    this.createGroup();
  }
  createGroup() {
    this.submitted = true;
    if (this.groupchatForm.invalid) {
      this.toastr.error("Please fill the details");
      return;
    }

    const data: any = {
      users: this.userArray,
      // groupName: this.groupchatForm.get('name')?.value,
      groupName: this.groupchatForm.get("name")?.value,

      name: this.groupchatForm.get("name")?.value,
      senderId: this.senderId,
      createdBy: "chatMain",
    };
    this.webSocketService.createGroup(data);

    this.groupchatForm.reset(); // reset the form
    this.userArray = []; // clear the userArray

    this.getChatList("");
  }
  changeChat(ids: any) {
    this.contactId = ids;
  }

  getId(id: any) {
    this.ChatIdModal = id;
  }
  deleteGroup() {
    let data = {
      loginId: this.loggedInUserId,
      chatId: this.ChatIdModal,
    };
    this.webSocketService.deleteChatGroup(data);
    this.getChatList("");

    // this.fetchAllGroups()
  }
}
