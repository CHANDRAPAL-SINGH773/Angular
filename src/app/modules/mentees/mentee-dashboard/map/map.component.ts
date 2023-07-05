import { Component, OnInit, ViewChild , ElementRef, NgZone} from '@angular/core';
import { AgmMap } from '@agm/core';
// import { MapsAPILoader } from "@agm/core/services/maps-api-loader/maps-api-loader";
// import { google } from 'google-maps';
import { MenteeService } from 'src/app/Services/mentee/mentee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from'@angular/common';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  geoCoder: any;

  lat = 22.4064172;
  long = 69.0750171;
  zoom=5;

  latitude: any
  longitude: any
  google: any;
  pid:any;
  sid:any;
  // https://sites.google.com/site/gmapsdevelopment/
  markers:any = [
        // {
        //     lat: 21.1594627,
        //     lng: 72.6822083,
        //     label: 'Surat',
        //     icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        //     photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4NaEwL9S7faanBQrwmbxcdy8U4QvnN-gUEqOekZtB8w&s'
        // },
        // {
        //     lat: 23.0204978,
        //     lng: 72.4396548,
        //     label: 'Ahmedabad',
        //     icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        //     photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4NaEwL9S7faanBQrwmbxcdy8U4QvnN-gUEqOekZtB8w&s'
        // },
        // {
        //     lat: 22.2736308,
        //     lng: 70.7512555,
        //     label: 'Rajkot',
        //     icon:'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        //     photo:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4NaEwL9S7faanBQrwmbxcdy8U4QvnN-gUEqOekZtB8w&s'
        // }
    ];


  constructor(
    // private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private route: ActivatedRoute,
    private menteeservice : MenteeService,
     private ngZone: NgZone,
      private location: Location,
) { }
  @ViewChild('map')
  public agmMap!: AgmMap;

  // public searchElementRef!: ElementRef;
  places: any;

    ngAfterViewInit(): void {
      if (this.agmMap) {
        // this.geoCoder = new google.maps.Geocoder;
        setTimeout(() => {
          this.agmMap.triggerResize();


        }, 100);



// start

    // let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    // autocomplete.addListener("place_changed", () => {
    //   this.ngZone.run(() => {
    //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //     if (place.geometry === undefined || place.geometry === null) {
    //       return;
    //     }

    //     this.latitude = place.geometry.location.lat();
    //     this.longitude = place.geometry.location.lng();
    //     // this.zoom = 12;
    //   });
    // });

//end





      } else {
        console.log('map was not rendered');
      }
    }
  ngOnInit(): void {
    this.route.queryParams.subscribe((val: any) => {
      this.pid = val.pid;
      this.sid=val.sid
      this.getMAp()
    })

    // this.mapsAPILoader.load().then(() => {
    //   // this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;

    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });

    
  }

  getMAp(){
    let pid='';
    let sid='';
    this.menteeservice.getMarkers(this.pid,this.sid).subscribe((res:any)=>{

      console.log("res")
      console.log(res)

      let userList:[] = res.data;
      console.log("userList")
      console.log(userList)
      userList.forEach((element:any) => {
        console.log("element")
        console.log(element)
        
        let obj: any = {
          lat: element.user.lat,
          lng: element.user.lng,
          label: element.user.firstName,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          photo: "https://mean.stagingsdei.com:452/" + element.user.image,
          type: "mentee"
        };

      // if(element.type=='mentee'){
      //   obj["icon"]='http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      //  }
 
      //  if(element.type=='mentor'){
      //    obj["icon"]='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      //   }
 
       // icon :  element.type=='mentee'?'http://maps.google.com/mapfiles/ms/icons/blue-dot.png':,
 
         this.markers.push(obj)
    
    console.log("this.markers")
    console.log(this.markers)
        
      });
     
  

      this.markers.push( {
          lat: res.mentor.user.lat,
          lng: res.mentor.user.lng,
          label: res.mentor.user.firstName,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          photo: "https://mean.stagingsdei.com:452/" + res.mentor.user.image,
          type: "mentor"
        } );

        this.markers.push(
          {
            lat: res.session.lat,
            lng: res.session.lng,
            label: res.session.session_name,
            // icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            photo: "https://mean.stagingsdei.com:452/" + res.session.image,
            type: "session"
          } 
        )

    },
      error=>{

      })
  }


  addMarker(event:any) {
    console.log(`latitude: ${event.coords.lat}, longitude: ${event.coords.lng}`);
  }

  goBack(): void {
     this.location.back();
  }
}
