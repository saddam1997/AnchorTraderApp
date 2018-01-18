import { Component,   NgZone,   } from '@angular/core';
import {  IonicPage, NavParams, Platform,NavController,Events } from 'ionic-angular';
import { SendMessageWithContent } from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services'; 
import   *as socketIOClient  from 'socket.io-client';
import  *as sailsIOClient  from 'sails.io.js';
import { UserEmailId } from '../../interfaces/user-options';

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {   
  nickname = '';
  chatId = '';
  data:any; 
  user:any;
  socket:any;
  io:any= sailsIOClient(socketIOClient); 
  messageDetails: SendMessageWithContent = { sender: '', recipient: '',content:'',chatId:'' };
  messages =[] ;
userContent:any;
UserId: UserEmailId = { email: '' };
 chatid={
           "chatId": ""           
  }

  myInfo = this.messages[0];
  constructor(private ngZone: NgZone,public events: Events, public platform:Platform,private navCtrl:NavController,private navParams: NavParams, public _setupService: SetupService) {
 
   // debugger;  

  // this.io.sails.url = this._setupService.endpoint_url;
this.io.sails.url = "http://198.187.28.200:3000"; 

       this.userdata();

    this.messageDetails.sender=this.UserId.email;  
    this.nickname = this.messageDetails.sender; 
     console.log("this.nickname"+this.nickname);
    this.messageDetails.recipient=this.navParams.get('receiver');
    this.messageDetails.chatId=this.navParams.get('chatId'); 
    this.chatid.chatId=this.messageDetails.chatId;     
    console.log("this.chatid.chatId"+this.chatid.chatId);
        let backAction =  platform.registerBackButtonAction(() => {        
        this.navCtrl.pop();
        backAction();
      },2)
  
    var ngZ = this.ngZone;
     var event=this.events;

    // create connection between user based on chat id 

     this.io.socket.get('/chat/sendMessage',{chatId:this.messageDetails.chatId}, function(data, response){
    
     });
     // get old message based on chat id

      this._setupService.getChatMessages({chatId:this.messageDetails.chatId}).subscribe((response)=>{
       if(response.statusCode==200){      
        this.messages=response.data;
      }else{
       
      }
     })
     // event listner when any events brodcast messages

      this.io.socket.on('NEWMESSAGE', function(respons){ 
       console.log("this.messages.content "+respons);
        ngZ.run(() => {
        this.messages = respons.data;        
        event.publish("sharemessage",  this.messages);        
          
       });   
    })  
    

  
   //   this._setupService.getOldMessage().subscribe((response)=>{
   //   this.messages=response.data;    
   // })

   this.listenToDataChangeEvents();
 }

 userdata(){       
     this.user=JSON.parse(localStorage.getItem('logindetail'));
         if(this.user!=null||this.user!=undefined){
        this.UserId.email=this.user.trader.email;
      }
    }

listenToDataChangeEvents() {
 this.events.subscribe('sharemessage', (userData) => {  
       this.messages.push(userData);
       this.userContent='';
  }); 
        
 }

sendMessage() { 
  this.messageDetails.content = this.userContent  ;
   console.log("this.messageDetails.content = = "+this.messageDetails.content);
     this.io.socket.post('/chat/sendMessage',this.messageDetails, function(data, response){
     console.log("response  = = "+JSON.stringify(response)); 
    
   })

  }
  
 ionViewWillLeave() {
   this.io.socket.disconnect();
   delete this.io.sails;
  }


}
