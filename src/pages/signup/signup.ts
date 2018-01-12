import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams,AlertController,LoadingController,MenuController,ToastController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { UserOptions,SignUpDetails } from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services'; 
import { LoginPage } from '../../pages/login/login';



@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup1: UserOptions = { username: '', password: '' };
  signup: SignUpDetails = { fullName: '', mobileNumber: '', email: '', password: '', confirmPassword: '' };
  submitted = false;
  responseData:any;

  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController,public userData: UserData,public alertCtrl: AlertController,public menuCtrl: MenuController, public navParams: NavParams,public _setupService: SetupService,public toastCtrl: ToastController) {
  }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid){
       this.userData.signup(this.signup1.username);
        let loading = this.loadingCtrl.create({
         content: 'account creating...'
        });
  loading.present();
    this._setupService.createUserAccount(this.signup).subscribe((result) => {   
     if(result.statusCode== 200){
          this.responseData = result;         
          loading.dismiss();            
          localStorage.setItem('signUp',JSON.stringify(this.responseData));
          const response=JSON.parse(localStorage.getItem('signUp'));                  
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
            let toast = this.toastCtrl.create({
                     message: 'account created please login and verify !!',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                console.log("data "+data);
                this.navCtrl.setRoot(LoginPage); 
          }
        },
        {
          text: 'submit',
          handler: data => {
            if(!data.otp){
              let toast = this.toastCtrl.create({
                     message: 'Otp should be required please signUp retry',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
               
                toast.present();
            }
            else{
               let loading = this.loadingCtrl.create({
               content: 'verifying otp...'
             });
               loading.present();
                 this._setupService.VerificationEmail({"email": response.traderMailId,"otp": data.otp
                  }).subscribe((result) => {  
                loading.dismiss(); 
               if(result.statusCode== 200){
                     let toast = this.toastCtrl.create({
                     message: 'SignUp successfully',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });               
                toast.present();
                this.navCtrl.setRoot(LoginPage);
                 }             
             });
            }      
          }
        }
      ],
      enableBackdropDismiss: false
    });
    prompt.present();      
         
     }else{
       loading.dismiss();
          this.responseData = result;
           
              let toast = this.toastCtrl.create({
                     message: this.responseData.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
      }          
    });
   }
  }
  onLogin(){
    this.navCtrl.setRoot(LoginPage);
  }
     ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
      this.menuCtrl.enable(false);
    }
   ionViewWillLeave() {
     // enable the root left menu when leaving the tutorial page
    this.menuCtrl.enable(true);
  }
}