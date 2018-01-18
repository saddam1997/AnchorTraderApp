import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams,MenuController,ToastController,LoadingController,Events} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { UserOptions,LoginDetail } from '../../interfaces/user-options';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { SignupPage } from '../signup/signup';
import { DashboardPage } from '../dashboard/dashboard';
import { SetupService } from '../../providers/setup.services';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  loginDetail: LoginDetail = { email: '', password: '',lat:'', long:'' };
  responseData:any;
  public user:any;
  submitted = false;
  public userName:any;
constructor(public userData: UserData,public navCtrl: NavController,public toastCtrl: ToastController,public events: Events,public menuCtrl: MenuController, public navParams: NavParams,public _setupService: SetupService,public loadingCtrl: LoadingController) {
this.setCurrentPosition();

  }
 public setCurrentPosition() {
      if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.loginDetail.lat = position.coords.latitude;
        this.loginDetail.long = position.coords.longitude;     
      });
    }
  }
onlogin1(form: NgForm){
  this.submitted = true; 
  if (form.valid) {  
       this.userData.login(this.login.username);   
        let loading = this.loadingCtrl.create({
       content: 'Logging please wait...'
      }); 
        loading.present();
       this._setupService.createLoginDetail(this.loginDetail).subscribe((result) => { 
          if(result.statusCode== 200){
            this.responseData = result;             
             localStorage.setItem('logindetail',JSON.stringify(this.responseData));
              this.user=JSON.parse(localStorage.getItem('logindetail'));   
              this.userName=this.responseData.trader.email; 
              this.events.publish("shareObject", this.userName);         
             loading.dismiss();  
        this.navCtrl.setRoot(DashboardPage);
      }else{
                     this.responseData = result;
                     loading.dismiss();
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
    ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
      this.menuCtrl.enable(false);
    }
   ionViewWillLeave() {
     // enable the root left menu when leaving the tutorial page
    this.menuCtrl.enable(true);
  }
  onlogin11(form: NgForm) {   
    this.submitted = true; 
    if (form.valid) {  
      this.userData.login(this.login.username);  
      this.userName=this.loginDetail.email;   
      this.events.publish("shareObject", this.userName);         
      this.navCtrl.setRoot(DashboardPage);
    }
  }
  
  onSignup() {
    this.navCtrl.push(SignupPage);
  }
  forgotPassword(){
      this.navCtrl.push(ForgotpasswordPage);
 }

}
