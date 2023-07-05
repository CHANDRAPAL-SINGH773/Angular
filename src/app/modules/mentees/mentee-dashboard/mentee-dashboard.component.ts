import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-mentee-dashboard",
  templateUrl: "./mentee-dashboard.component.html",
  styleUrls: ["./mentee-dashboard.component.scss"],
})
export class MenteeDashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  logout() {
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }
}
