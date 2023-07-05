import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthorizationToken } from "./token";

@Injectable()
export class AuthGuardLogin extends AuthorizationToken implements CanActivate {
    user: any;
    constructor(private router: Router) { super() }

    /*   canActivate() {
          this.user = localStorage.getItem("token");
          let data = JSON.parse(this.user || '{}');
          // let dataToken = JSON.parse(data || '{}');
          // let role = dataToken.data.role;
          let role;
          console.log(data, "data");
          if (data) {
              role = data.data.role;
              console.log(role, "role");
  
              if (role === 1) {
                  this.router.navigate(["/mentor/mentor-dashboard"]);
                  return true;
              }
              if (role === 2) {
                  this.router.navigate(["/mentee/mentee-dashboard"]);
                  return true;
              } else {
                  return false;
              }
  
          }
          else
              return false;
      } */


    canActivate() {
        this.user = localStorage.getItem("token");
        let data = JSON.parse(this.user || '{}');

        if (data) {
            let role = data.data.role;
            console.log(role, "role");

            if (role === 1) {
                return true;
            }
            else {
                if(role===2){
                    this.router.navigate(["/mentor/mentor-dashboard"]);
                }
                if(role===0){
                    this.router.navigate(["/admin-dashboard"]);
                }
                return false
            }
        } else {
            return false;
        }
    }

}