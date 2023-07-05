import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {
    user: any;
    constructor(private router: Router) { }

    canActivate() {
        this.user = localStorage.getItem("token");      
        let data = JSON.parse(this.user);
        
        if (data)
            return true;
        else
            return this.router.createUrlTree([""]);
    }

}