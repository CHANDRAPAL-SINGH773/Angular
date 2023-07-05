import { Component, OnInit } from "@angular/core";
import { ToggleMenuService } from "src/app/Services/toggle-menu.service";
import { AuthorizationToken } from "../../Shared/token";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent extends AuthorizationToken implements OnInit {
  role: any;
  constructor(private _service: ToggleMenuService,
    private toastr: ToastrService,) {
    super();
    this._service.clicked.subscribe((res: boolean) => {
      this.clicked = res;
    });
  }
  clicked: boolean = false;

  ngOnInit(): void {
    this.role = this.getLocalStorageRole();
  }

  trigermenu() {
    this.clicked = false;
    // this._service.clicked.next(this.clicked);
  }
  showMessage(){
    this.toastr.info("You need to log in to access additional features")
  }
}
