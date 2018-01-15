import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  NavController, NavParams,Events ,Platform,ToastController} from 'ionic-angular';
import { updateValue,UserEmailId,Location} from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services';
import { Geolocation } from '@ionic-native/geolocation';
import   *as socketIOClient  from 'socket.io-client';
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
    io:any= sailsIOClient(socketIOClient); 

    public user:any;
	public cexdata:any;   
	public zebPayData:any;

	 submitted = false;
   location:Location={ email:'',lat:'',long:''};
   userEmail: UserEmailId = { email: ''};
   btcValue: updateValue= { email: '', buyRate: '',currencyType:'',volume:'',sellRate:'' };  
   inrValue: updateValue= { email: '', buyRate: '',currencyType:'',volume:'',sellRate:'' };   

  constructor(public toastCtrl: ToastController,private geolocation: Geolocation,public navCtrl: NavController,public platform: Platform,public events: Events, public navParams: NavParams,public _setupService: SetupService,) {
   this.userdata();
   this.setCurrentPosition();  
   //this.io.sails.url = 'http://198.187.28.200:3000';     // connect to socket  
    this.io.sails.url = 'http://192.168.1.20:3000';     // connect to socket  
   this._setupService.getBuydata().subscribe((response)=>{   
         this.cexdata=response.data.cex.bid;
         this.zebPayData=response.data.zeb.buy;         
   });
   
  }

  userdata(){      
       this.user=JSON.parse(localStorage.getItem('logindetail'));
       console.log("this.user "+JSON.stringify(this.user));
       if(this.user!=null||this.user!=undefined){
       this.userEmail.email=this.user.trader.email;  
      }
   }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad DashboardPage');
  }

  

// get current position
public setCurrentPosition() {  
  this.platform.ready().then(() =>  {        
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
         var res =response;     
      });
       }).catch((error) => {   
     });
   });     
   
  }

  updateBTC(form: NgForm){
    this.btcValue.currencyType="BTC";
    this.btcValue.email=this.userEmail.email; 
    this.submitted = true;     
     if (form.valid) {    
        this.io.socket.post('/trader/buySellUpdate',this.btcValue, function(data, response){
          console.log("response  = = "+JSON.stringify(response)); 
    
       }) 
    // this._setupService.updateprice(this.btcValue).subscribe((response)=>{
    //   var res=response;       
    //    let toast = this.toastCtrl.create({
    //                  message: 'update BTC buy/sell rate',
    //                  showCloseButton: true,
    //                  closeButtonText: 'Ok',
    //                  duration: 5000
    //             });
    //             toast.present();  

    // });
   }
  }

  updateINR(form: NgForm){   
    this.inrValue.currencyType="INR";
    this.inrValue.email=this.userEmail.email;  
    this.submitted = true; 
     if (form.valid) {    

    this.io.socket.post('/trader/buySellUpdate',this.inrValue, function(data, response){
     console.log("response  = = "+JSON.stringify(response)); 
    
   })     
    // this._setupService.updateprice(this.inrValue).subscribe((response)=>{
    //   var res=response;
    //    let toast = this.toastCtrl.create({
    //                  message: 'update INR buy/sell rate',
    //                  showCloseButton: true,
    //                  closeButtonText: 'Ok',
    //                  duration: 5000
    //             });
    //             toast.present();  
    // });
   }
  }


  ionViewWillLeave() {
   this.io.socket.disconnect();
   delete this.io.sails;
  }


}
