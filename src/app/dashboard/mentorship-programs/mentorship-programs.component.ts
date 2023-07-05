import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mentorship-programs",
  templateUrl: "./mentorship-programs.component.html",
  styleUrls: ["./mentorship-programs.component.scss"],
})
export class MentorshipProgramsComponent implements OnInit {
  constructor() {}
  tabCollapse: boolean = true;
  ngOnInit(): void {}
}
