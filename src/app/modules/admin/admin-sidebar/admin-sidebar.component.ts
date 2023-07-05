import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToggleMenuService } from "src/app/Services/toggle-menu.service";
@Component({
  selector: "app-admin-sidebar",
  templateUrl: "./admin-sidebar.component.html",
  styleUrls: ["./admin-sidebar.component.scss"],
})
export class AdminSidebarComponent implements OnInit {
  constructor(private router: Router, private _toggle: ToggleMenuService) {}
  clicked: boolean = false;
  ngOnInit(): void {
    this._toggle.clicked.subscribe((res) => {
      this.clicked = res;
    });
  }

}
