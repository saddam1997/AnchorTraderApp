import { Component } from '@angular/core';
import { NavController, LoadingController,ToastController,AlertController } from 'ionic-angular';
import { PasswordValues,UserEmailId } from '../../interfaces/user-options';
import { DashboardPage } from '../dashboard/dashboard';
import { SetupService } from '../../providers/setup.services'; 
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
	public user:any;
  public verifyEmail:boolean;	 
       userEmail: UserEmailId = { email: ''};
       passwordValue = {"userMailId": "","currentPassword": "","newPassword": "", "confirmNewPassword": "" };
       otpvalues =     { "userMailId": "",  "otp": "" };
       constructor(public navCtrl: NavController,public alertCtrl: AlertController,public toastCtrl: ToastController,public _setupService: SetupService,public loadingCtrl: LoadingController) 
       {
          this.userdata();     
          this.verifyEmail=false;        
       }

       userdata(){      
       this.user=JSON.parse(localStorage.getItem('logindetail'));
       if(this.user!=null||this.user!=undefined){
       this.userEmail.email=this.user.trader.email;
       this.verifyEmail=this.user.trader.verifyEmail;

      }
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  // change current password

  changeCurrentPassword(){
       let prompt = this.alertCtrl.create({
      title: 'Change Password',       
      inputs: [
        {          
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password',         
          
        },
         {          
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password',         
          
        },
         {          
          name: 'confirmNewPassword',
          type: 'password',
          placeholder: 'Confirm New Password',         
          
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {            
                
          }
        },
        {
          text: 'submit',
          handler: data => {
            let loading = this.loadingCtrl.create({
           content: 'updating current password...'
        });
            loading.present();
            this.passwordValue.userMailId=this.userEmail.email;
            this.passwordValue.currentPassword=data.currentPassword;
            this.passwordValue.newPassword=data.newPassword;
            this.passwordValue.confirmNewPassword=data.confirmNewPassword;
                   
            this._setupService.changecurrentpasswords(this.passwordValue).subscribe((response) => {
              if(response.statusCode== 200){
                 loading.dismiss();
                  let toast = this.toastCtrl.create({
                     message: 'Password change successfully',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                     this.navCtrl.setRoot(DashboardPage);
                 }    
                 else{
                     loading.dismiss();
                     let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                 }         
             } );        
          }
        }
      ],
      enableBackdropDismiss: false
    });
    prompt.present(); 
  }

// veryfy email id
  veryfyEmail(){
    let loading = this.loadingCtrl.create({
           content: 'sending otp in your emailId..'
        });
    loading.present();
    this._setupService.EmailVerifyforAccount(this.userEmail).subscribe((response)=>{
      loading.dismiss();
      let prompt = this.alertCtrl.create({
      title: 'Enter One Time Password',       
      inputs: [
        {          
          name: 'otp',
          type: 'password',
          placeholder: 'One Time Password',  
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {           
                
          }
        },
        {
          text: 'submit',
          handler: data => {
            let loading = this.loadingCtrl.create({
           content: 'verifying OtP...'
        });
            loading.present();
            this.otpvalues.userMailId= this.userEmail.email
            this.otpvalues.otp=data.otp;                                
            this._setupService.VerificationEmail(this.otpvalues).subscribe((response) => {
               if(response.statusCode== 200){
                 this.navCtrl.setRoot(DashboardPage);
                 loading.dismiss();
                 localStorage.setItem('logindetail',JSON.stringify(response));
                this.user=JSON.parse(localStorage.getItem('logindetail'));
                 this.userEmail.email=this.user.trader.email;
                this.verifyEmail=this.user.trader.verifyEmail;
                this.verifyEmail=true;
                 let toast = this.toastCtrl.create({
                     message: 'verify email successfully !!',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                }    
                 else{
                   loading.dismiss();
                     let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();                  
                 }         
             } );        
          }
        }
      ],
      enableBackdropDismiss: false
    });
    prompt.present(); 
    });
  }

}
