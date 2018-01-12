import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams,AlertController,MenuController,ToastController,LoadingController } from 'ionic-angular';
import { Otpvalue,UserEmailId } from '../../interfaces/user-options';
import { LoginPage } from '../login/login';
import { SignupPage} from '../signup/signup';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { SetupService } from '../../providers/setup.services';
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
responseData:any;
 emailId: UserEmailId = { email: '' };
 otpvalue: Otpvalue = { traderMailId: '', otp: '',};
  submitted = false;
  constructor(public navCtrl: NavController,public toastCtrl: ToastController,public menuCtrl: MenuController, public navParams: NavParams,public alertCtrl: AlertController,public _setupService: SetupService,public loadingCtrl: LoadingController) {
  }

   ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
     this.menuCtrl.enable(false);
    }
   ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menuCtrl.enable(true);
  }

  forgotPassword(form: NgForm){
  	this.submitted = true; 
  	 if (form.valid) {  
     let loading = this.loadingCtrl.create({
       content: 'sending otp in your mailId...'
      });
  loading.present();
   this._setupService.forgotPassword(this.emailId).subscribe((response) => { 
    if(response.statusCode== 200){
     this.responseData = response;  
    loading.dismiss();
     localStorage.setItem('ResponseData',JSON.stringify(response));    
     let toast = this.toastCtrl.create({
                     message: 'OTP sent to your email id',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
      let prompt = this.alertCtrl.create({
      title: 'One Time Password',      
      inputs: [
        {          
          name: 'otp',
          type: 'password',
          placeholder: 'One Time Password'
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
       content: 'verifying otp...'
      });
            loading.present();
            this._setupService.forgotPasswordOTP({"userMailId": response.userMailId,"otp": data.otp
                  }).subscribe((response) => {   
               if(response.statusCode== 200){                                  
                  this.navCtrl.push(ChangepasswordPage);
                   loading.dismiss();
                 }       
                 else {
                     let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                  toast.present(); 
                  loading.dismiss();
                    }      
             } );        
          }
        }
      ],
      enableBackdropDismiss: false
    });
    prompt.present(); 
     }else{
          this.responseData = response;
                let toast = this.toastCtrl.create({
                     message: this.responseData.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                 loading.dismiss(); 
     }          
            
 });
 }
}
 login(){
   this.navCtrl.setRoot(LoginPage);
 }
     signup(){ 
         this.navCtrl.setRoot(SignupPage);
  }

}


