import { Component } from '@angular/core';
import {  NavController, NavParams ,Platform  } from 'ionic-angular';
import { SetupService } from '../../providers/setup.services';
import { ChatroomPage } from '../../pages/chatroom/chatroom';
import { UserEmailId } from '../../interfaces/user-options';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the ChatuserlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-chatuserlist',
  templateUrl: 'chatuserlist.html',
})
export class ChatuserlistPage {

 public userData:any=[];
  nickname = '';
  UserId: UserEmailId = { email: '' };
  public user:any;
  public friendList:any;
  public latitude: number;
  public longitude: number;
  public zoom: number;
 
  isAccept:{
     isAccepted:boolean;
  }
  constructor(private geolocation: Geolocation,public _setupService: SetupService, public navCtrl: NavController, public navParams: NavParams,public platform: Platform) {
     let backAction =  platform.registerBackButtonAction(() => {        
        this.navCtrl.pop();
        backAction();
      },2)
     this.userdata();
     // this._setupService.getfrienlist1(this.UserId.email).subscribe((response) => {
     //    if(response.statusCode==200){
     //      this.friendList=response.data; 
     //      console.log("this.friendList = = "+JSON.stringify(this.friendList));      
     //    }               
     //  });
this.getFriendList();
     
  }

  getFriendList(){
     this._setupService.getfrienlist1().subscribe((response) => {
      let sortData = response.sort(function(a, b){       
          var keyA = a.isAccepted,
              keyB = b.isAccepted;
          // Compare the 2 dates
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
      });
          this.friendList=sortData;  
      });
  }

  userdata(){       
     this.user=JSON.parse(localStorage.getItem('logindetail'));
         if(this.user!=null||this.user!=undefined){
        this.UserId.email=this.user.trader.email;
      }
    }

   openChat(senderEmail,receiverEmail,chatId){  
   // alert("senderEmail = = "+senderEmail);  
   // alert("receiverEmail = = "+receiverEmail);
   // alert("chatId = = "+chatId);    
         this.navCtrl.push(ChatroomPage, { sender: senderEmail, receiver: receiverEmail,chatId:chatId});    
  }
  
  joinChat() {
      this.navCtrl.push('ChatRoomPage', { nickname: this.nickname });
  }

  ionViewDidLoad() {
  this.platform.ready().then(() =>  {        
         let options = {
            enableHighAccuracy: true, 
            maximumAge: 3600,
            timeout:10000
       }; 
       this.geolocation.getCurrentPosition(options).then((response) => {
       this.latitude =response.coords.latitude;         
       this.longitude =response.coords.longitude;     
      this.zoom = 16;      

       }).catch((error) => {   
     });
   });  

  }

  
  //Kunvar singh ---Date : 8th Jan, 2018
  acceptRequestByTrader() {
    this.isAccept.isAccepted=true;
    let accept = true;
    this._setupService.acceptRequest(this.isAccept.isAccepted).subscribe((response) => { 
      if(response){
        this.getFriendList();
      }
    });

  }

  rejectRequestByTrader() {
    this.isAccept.isAccepted=false;
    this._setupService.rejectRequest(this.isAccept.isAccepted).subscribe((response) => { 
      if(response){
         this.getFriendList();
      }
    });
  }

}

