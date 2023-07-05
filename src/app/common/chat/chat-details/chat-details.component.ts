import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { log } from "console";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { MenteeService } from "src/app/Services/mentee/mentee.service";
import { WebSocketService } from "src/app/Services/web-socket.service";
import { AuthorizationToken } from "src/app/Shared/token";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-chat-details",
  templateUrl: "./chat-details.component.html",
  styleUrls: ["./chat-details.component.scss"],
})
export class ChatDetailsComponent extends AuthorizationToken implements OnInit {
  oneUserData: any;
  recieverDetails: any = [];
  isValidChatId: boolean = false;
  loggedInUserId: any;
  baseUrl: any = environment.apiUrl;
  message: any = "";
  allMessages: any;
  imageURL: any;
  recieverUserImage: any;
  loggedInUserRole: any;
  isMessageImportant: boolean = false;
  showSendOptions: boolean = false;
  attachmentFile: any;
  attachmentToUpload: any;

  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;
  isAudioSent = false;

  currentIndex: any = -1;
  showFlag: any = false;
  imageObject: Array<object> = [];
  groupForm: any;

  groupImageSelected: any;
  groupImageToUpload: any;
  selectedTab: number = 1;

  searchTerm = "";
  caseSensitive = false;

  contextMenuStyle: any;
  messageToDelete: any;
  id: any;
  singleChatName: any;
  usersNameChat: any;
  receiverName: any;
  receiverimageData: any;
  imgsrc: any;
  showImage: any = environment.urlBackend;
  @Output() latestMessage = new EventEmitter();
  groupchatName: any;
  submitted: boolean = false;
  imagefiles: any;
  deleteMessageSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];
  menteeList: any = [];
  loginError: any;
  errortext: any;
  groupId: any;
  userList: any = [];
  UserData: any;
  dataToPass: any = {};
  Messageid: any;
  selection: any;
  userArray: any = [];
  userMessageDetails: any;
  enableUser!: number;
  getid: any;
  showMesaage: boolean = true;
  listusersArray: any = [];
  finalgroupCount: any;
  loggedInUserName: any;
  creatorName: any;
  imgsrcprofile: any;
  togglechatList: boolean = false;

  constructor(
    private commonServ: MenteeService,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private menteeService: MenteeService
  ) {
    super();
    this.loggedInUserId = this.getLocalStorageID();
    this.loggedInUserRole = this.getLocalStorageRole();
    this.loggedInUserName = this.getLocalStorageByName();

    this.webSocketService.joinRoom({
      room: this.loggedInUserId,
    });
    this.webSocketService.newMessageReceived().subscribe((data: any) => {
      if (data.room == this.recieverDetails._id) {
        data.message.content = data.message.content;
        data.message.sender = data.message.sender;

        console.log(
          data,
          "message====",
          data.userBlocked.includes(this.getLocalStorageID()),
          this.getLocalStorageID()
        );

        if (!data.userBlocked.includes(this.getLocalStorageID())) {
          this.allMessages.unshift(data.message);
        }
      }
      if (data.message.sender._id != this.loggedInUserId) {
        // this.markMessageAsRead()
      }
    });

    this.webSocketService.groupDetailsUpdated().subscribe((res: any) => {
      this.groupchatName = res.data.groupDetails.name;
      // this.groupchat
    });

    this.groupForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      ckeckedUsers: new FormArray([]),
    });
    this.groupImageSelected = this.groupImageToUpload = null;
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((val: any) => {
      this.id = val.params.chatId;
      this.getChatMessages(this.id);
    });
    this.deletedMessage();

    this.webSocketService
      .receivedNotificationInfo()
      .subscribe((res: any) => { });
  }

  getUpdatedListMember() {
    this.webSocketService.updatedRoomMembers().subscribe((res: any) => { });
  }

  async getChatMessages(chatIdS: any) {
    const data = { chatId: chatIdS };
    this.commonServ.getChatMessage(data).subscribe((res: any) => {
     
      if (res) {
        this.isValidChatId = true;
        this.recieverDetails = [res.data.groupedData];
        this.recieverDetails.map((user: any) => {
          let data = user.users.filter((e1: any) => {
            return e1.userId?._id === this.loggedInUserId && e1.status === 2;
          });
          
          if (this.id == user._id && data.length > 0) {
            this.showMesaage = false;
          } else {
            this.showMesaage = true;
          }
        });
     
        res.data.AllData.docs.map((message: any) => {
          message.content = message.content;
        });
        this.recieverDetails.map((el: any) => {
          console.log(el, "receiverNamereceiverName");

          if (!el.isGroupChat) {
            el.users.forEach((element: any) => {
              if (element._id != this.loggedInUserId) {
                el.chatName = element.name;

                if (this.loggedInUserRole !== 0) {
                  

                  if (element.userId._id != this.loggedInUserId) {
                   
                    if (element.role !== 0||element.role!==undefined) {
                    
                      this.receiverName = element.userId.firstName
                      this.receiverimageData = element.userId.image;

                    }
                  }
                } else {
                  this.receiverName = element.userId.firstName; 
                  this.receiverimageData = element.userId.image;
                }


                this.receiverimageData = element.userId.image;
                this.imgsrc = this.receiverimageData
                  ? this.showImage + this.receiverimageData
                  : "";
                if (element.image && element.image != "null") {
                  this.recieverUserImage = this.baseUrl + element.image;
                } else {
                }
              }
            });
          }
          el.chatName = el.chatName;

          if (el.isGroupChat) {
            el.chatName = el.groupDetails?.name
              ? el.groupDetails.name
              : el.chatName;

            (this.groupchatName = el.groupDetails?.name),
              (this.imgsrc = el.groupDetails?.image);
            console.log(el.groupDetails, "groupDetails");
          }
        });
        this.recieverDetails = this.recieverDetails[0];

        this.allMessages = res.data.AllData.docs;

        // this.userMessageDetails = res.data.AllData.docs.sender;

        this.imgsrcprofile = this.showImage;

        this.webSocketService.joinRoom({
          user: this.id,
          room: this.id,
        });

        // this.markMessageAsRead();
      } else {
        this.isValidChatId = false;
      }
    });
  }

  // markMessageAsRead() {
  //   const data = { loggedInUserId: this.loggedInUserId, chatId: this.id };
  //   console.log(data, "data")
  //   this.webSocketService.markMessageAsRead(data);
  // }

  showSendOption() {
    if (this.loggedInUserRole == "admin") {
      this.showSendOptions = false;
    } else if (
      this.loggedInUserRole == "nursing_home" &&
      this.recieverDetails.isGroupChat
    ) {
      this.showSendOptions = true;
    } else if (
      this.loggedInUserRole == "nursing_home" &&
      !this.recieverDetails.isGroupChat
    ) {
      this.showSendOptions = false;
    } else {
      this.showSendOptions = true;
    }
  }

  formatDate(date: string) {
    return this.commonServ.formatDate(date);
  }

  async sendMessage() {
    if (this.message == "") {
      this.toastr.error("Please type a message to continue.");
      return;
    }

    const socketData = {
      // content: this.encrypt(this.message),

      content: this.message,
      isImportant: false,
      sender: {
        _id: this.loggedInUserId,
        role: this.loggedInUserRole,
        image: this.getLocalStorageByImage(),
        socketData: true,
      },
      createdAt: new Date(),
    };
    this.webSocketService.sendMessage({
      room: this.id,
      user: "Prashant",
      message: socketData,
    });
    this.message = "";
  }

  uploadGroupIcon() {
    return new Promise((resolve) => {
      const uploadData = new FormData();
      uploadData.append("file", this.groupImageToUpload);
      this.commonServ.uploadMessageImage(uploadData).subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  async updateGroupDetails() {
    this.submitted = true;
    // if (this.groupForm.invalid) {
    //   this.toastr.error('Form is invalid');
    //   return;
    // }
    let data = {
      chatName: this.groupForm.get("name").value,
      chatId: this.recieverDetails._id,
      image: this.groupImageSelected,
    };
    console.log(data, "data yyyyy");

    if (this.groupImageToUpload) {
      await this.uploadGroupIcon().then((res: any) => {
        if (res.messageID == 200) {
          data.image = res.data.path;
        } else {
          this.toastr.error(res.message);
          return;
        }
      });
    }
    this.webSocketService.updateGroupEmit(data);

    this.webSocketService.groupDetailsUpdated().subscribe((res: any) => {
      console.log(res, "res reply");

      if (res.messageID == 200) {
        this.toastr.success("success");
        this.recieverDetails = [res.data];
        this.recieverDetails.map((el: any) => {
          if (el.isGroupChat) {
            el.chatName = el.groupDetails.name
              ? el.groupDetails.name
              : el.chatName;
          }
        });
        this.recieverDetails = this.recieverDetails[0];
        this.groupImageSelected = this.groupImageToUpload = null;
        this.groupImageSelected =
          this.baseUrl + this.recieverDetails.groupDetails.image;
        this.selectedTab = 1;
        this.groupForm.resetForm();
      } else {
        this.toastr.error("error");
      }
    });
  }

  groupFormPatchValue() {
    this.groupForm.patchValue({
      name: this.groupchatName,
      image: this.groupForm.groupImageSelected,
    });
  }

  removeMemberFromGroup(event: any) {
    this.dataToPass = {
      userId: event,
      chatId: this.id,
    };
  }

  removeUser() {
    this.webSocketService.removeMemberFromGroup(this.dataToPass);
    // .subscribe((res: any) => {
    //   if (res.status === "Success" && res.messageID === 200) {
    //     this.toastr.success(res.message, res.status,);
    //   } else {
    //     this.toastr.error(res.message, res.status);
    //   }
    // })
  }

  submit() {
    this.createGroup();
  }
  createGroup() {
    const data: any = {
      users: this.userArray,
      // groupName: this.groupForm.get('name')?.value,
      // name: this.groupForm.get('name')?.value,
      senderId: this.loggedInUserId,
      chatId: this.id,
      createdBy: this.loggedInUserId,
    };

    this.webSocketService.addMemberInGroup(data);
    this.groupForm.reset(); // reset the form
    this.userArray = []; // clear the userArray
  }

  deleteMessages(id: any) {
    this.Messageid = id;

    // this.webSocketService.deleteMessage({ _id: id, chatId: this.recieverDetails._id });
  }

  deleteMessageTrigger() {
    this.webSocketService.deleteMessage({
      _id: this.Messageid,
      chatId: this.recieverDetails._id,
    });
  }

  deletedMessage() {
    this.deleteMessageSubscription = this.webSocketService
      .deleteMessageSubscription()
      .subscribe((res: any) => {
        if (res.messageID == "responses.SUCCESS_CODE") {
          let deletedMessage = this.allMessages.find(
            (obj: any) => obj._id === res.UpdateStatus.MessageId
          );
          // if (deletedMessage) {
          //   deletedMessage.isDeleted = true;
          // }
          console.log(deletedMessage, "check message");
          this.getChatMessages(this.id);

          // if (deletedMessage) {
          //   deletedMessage.isDeleted = true;
          //   this.webSocketService.deleteMessage('delete-message');
          // }
        }
      });
    this.subscriptions.push(this.deleteMessageSubscription);
  }

  handleimage(event: any, type: any) {
    if (event.target.files && event.target.files[0]) {
      if (type === "image") {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.groupImageSelected = event.target.result;
        };
        this.groupImageSelected = event.target.files[0];
      }
    }
  }

  opengroupList() {
    this.commonServ.getmeenteeinGroup(this.id).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          //  this.toastr.success(res.message, res.status,);
          this.menteeList = res.data;
          console.log(this.menteeList, "menteelist");
          // this.creatorName = this.menteeList.groupAdmin.firstName
          this.menteeList.forEach((el: any) => {
            this.creatorName = el.groupAdmin.firstName;
          });

          this.listusersArray = [];
          this.menteeList.map((e1: any) => {
            e1.users.forEach((ele: any) => {
              if (ele.userId._id != this.loggedInUserId) {
                this.listusersArray.push(ele);
              }
            });
          });
          this.finalgroupCount = this.listusersArray.length;

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

  showlist() {
    this.commonServ.getAllUsers().subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          //  this.toastr.success(res.message, res.status,);
          this.UserData = res.data.docs;
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

  onCheckboxChange(event: any) {
    const userschecked = this.groupForm.controls["ckeckedUsers"] as FormArray;
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

  blockUser(event: any, userId: any) {
    let status = event.target.checked;
    if (status == true) {
      status = 1; // Active
    } else {
      status = 2; //disable
    }
    let data = {
      userId: userId,
      status: status,
      chatId: this.id,
    };
    this.menteeService.blockUser(data).subscribe(
      (res: any) => {
        if (res.status === "Success" && res.messageID === 200) {
          this.toastr.success(res.message, res.status);
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
  isMatch(str: string): boolean {
    const pattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/i;
    return pattern.test(str);
  }
  trigermenu() {
    this.togglechatList = !this.togglechatList;
    this.menteeService.clicked.next(this.togglechatList);
  }
}
