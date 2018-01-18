import { Component,NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  NavController,NavParams,Events ,Platform,ToastController} from 'ionic-angular';
import { updateValue,UserEmailId,Location} from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services';
import { Geolocation } from '@ionic-native/geolocation';
import  *as socketIOClient  from 'socket.io-client';
import *as sailsIOClient  from 'sails.io.js';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.      
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

   io:any= sailsIOClient(socketIOClient); //375-384 sails.io.js in nodemodule 
    
   user:any;
   cexdata:any;   
   zebPayData:any;
   submitted = false; 
   location:Location={ email:'',lat:'',long:''};
   userEmail: UserEmailId = { email: ''};
   btcValue: updateValue= { email: '', buyRate: '',currencyType:'',volume:'',sellRate:'' };  
   inrValue: updateValue= { email: '', buyRate: '',currencyType:'',volume:'',sellRate:'' };   
  
  constructor(private ngZone: NgZone,public toastCtrl: ToastController,private geolocation: Geolocation,public navCtrl: NavController,
  public platform: Platform,public events: Events, public navParams: NavParams,public _setupService: SetupService,) { 
   
    this.io.sails.url = "http://198.187.28.200:3000";  
    this.userdata();
    this.getCurrencyPrice(); 
    this.getCurrentPosition();  
    this.getTradersSetValue();  
  }

 

  userdata(){      
       this.user=JSON.parse(localStorage.getItem('logindetail'));         
       if(this.user!=null||this.user!=undefined){
       this.userEmail.email=this.user.trader.email;  
      }
   }

   getCurrencyPrice(){
    this._setupService.getBuydata().subscribe((response)=>{ 
    if(response.statusCode==200) {
         this.cexdata=response.data.cex.bid;
         this.zebPayData=response.data.zeb.buy;
    }
   });
  }


  // get current position
 getCurrentPosition() {  
  this.platform.ready().then(() =>   {        
         let options = {
            enableHighAccuracy: true, 
            maximumAge: 3600,
            timeout:10000
       }; 
       this.geolocation.getCurrentPosition(options).then((response) => {        
        this.location.lat=response.coords.latitude; 
        this.location.long=response.coords.longitude; 
        this.location.email= this.userEmail.email;
       this._setupService.sentLocation(this.location).subscribe((response)=>{

      });
       }).catch((error) => {   
     });
   }); 
  }

//get traders updated values 

  getTradersSetValue(){
  this._setupService.getTraderInfo(this.userEmail).subscribe((response) => { 
    if(response.data != null){
      for(var i=0;i<response.data.length;i++){
        switch (response.data[i].currencyType) {
          case "INRW":
            this.inrValue.buyRate = response.data[i].buyRate;
            this.inrValue.sellRate = response.data[i].sellRate;
            this.inrValue.volume = response.data[i].volume;
            break;

          case "BTC" :
            this.btcValue.buyRate = response.data[i].buyRate;
            this.btcValue.sellRate = response.data[i].sellRate;
            this.btcValue.volume = response.data[i].volume;
          break;

          default:
            // code...
            break;
        }
      }
    }
  })
}  

// update BTC values 

  updateBTC(form: NgForm){
    this.btcValue.currencyType="BTC";
    this.btcValue.email=this.userEmail.email; 
    this.submitted = true;     
     var ngZ = this.ngZone;
    var event=this.events;
     if (form.valid) {    
      
        this.io.socket.post('/trader/buySellUpdate',this.btcValue, function(data, response){
       ngZ.run(() => {         
           event.publish("ShareResponse",  response);
       });   
    
       }) 
        this.listenToDataChangeEvents();   
   }
  }

 // update INR values 

  updateINR(form: NgForm){   
    this.inrValue.currencyType="INRW";
    this.inrValue.email=this.userEmail.email;  
    this.submitted = true; 
      var ngZ = this.ngZone;
    var event=this.events;
     if (form.valid) {    
    this.io.socket.post('/trader/buySellUpdate',this.inrValue, function(data, response){             
         ngZ.run(() => {       
           event.publish("ShareResponse",  response);
       });       
       }) 
        this.listenToDataChangeEvents();    
   }
  }

   listenToDataChangeEvents() {
   this.events.subscribe('ShareResponse', (res) => {    
        let toast = this.toastCtrl.create({
                     message: res.body.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 2000
                });
                toast.present(); 
  });   
 }

  ionViewWillLeave() {    
   this.io.socket.disconnect();
   delete this.io.sails;   
  }


}
