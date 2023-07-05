import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-mentor-dashboard",
  templateUrl: "./mentor-dashboard.component.html",
  styleUrls: ["./mentor-dashboard.component.scss"],
})
export class MentorDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  logout() {
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }
}
