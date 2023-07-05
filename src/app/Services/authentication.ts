import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class Authentication{
    constructor(private http: HttpClient,
        ) { }
        // setToken(token:string){

        //     localStorage.setItem('token',token);
        
        //   }
        
        
        
        
        //   setRole(role:string){
        
        //     localStorage.setItem('role',role);
        
        //   }
          getRole(){
        let user = localStorage.getItem("token");
        let data = JSON.parse(user || '{}');
        let role = data?.data?.role; 
        return role;
          }        
          getToken(){
            let user = localStorage.getItem("token");
            let data = JSON.parse(user || '{}');
            let token = data?.data?.token;                 
            return token;
          }
        //   setRefreshToken(refresh:string){
        
        //     localStorage.setItem('refresh',refresh);
        
        //   }
        
        
        
        
        //   getRefreshToken(){
        
        //     return localStorage.getItem('refresh');
        
        //   }
          isLoggedIn(){          
          return this.getToken() != null
          }
}