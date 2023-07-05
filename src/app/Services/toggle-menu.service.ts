import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ToggleMenuService {
  clicked = new Subject<boolean>();

  constructor() {}
}
