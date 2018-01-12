import { Component } from '@angular/core';
import { NavController,NavParams, LoadingController,MenuController,ToastController,AlertController } from 'ionic-angular';
import { SetupService } from '../../providers/setup.services';
import { LoginPage } from '../login/login';
import { NewPasswordvalue } from '../../interfaces/user-options';
import { NgForm } from '@angular/forms';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
public user:any;
submitted = false;
 newPasswordvalue: NewPasswordvalue = { userMailId: '', newPassword: '', confirmNewPassword: '' };
  constructor(public navCtrl: NavController,public toastCtrl: ToastController,public menuCtrl: MenuController,public alertCtrl: AlertController,public _setupService: SetupService,public loadingCtrl: LoadingController) {  
  this.userdata();   
  }
   userdata(){
       this.user=JSON.parse(localStorage.getItem('ResponseData')); 
       this.newPasswordvalue.userMailId=this.user.userMailId;
      
  }

  changecurrentPassword(form: NgForm){  
    alert("this.newPasswordvalue "+this.newPasswordvalue.userMailId);
        alert("this.newPasswordvalue "+this.newPasswordvalue.newPassword);
            alert("this.newPasswordvalue "+this.newPasswordvalue.confirmNewPassword);
  	this.submitted = true; 
  	 if (form.valid) {  
   let loading = this.loadingCtrl.create({
           content: 'updating current password...'
     }); 	
    loading.present();
   this._setupService.updateForgotPassord(this.newPasswordvalue).subscribe((response) => { 
      if(response.statusCode==200){
         loading.dismiss();
        let toast = this.toastCtrl.create({
                     message: 'Password update successfully',
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present();
                this.navCtrl.setRoot(LoginPage); 
              }else{
                 loading.dismiss();
                let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
              }
    });
  }
 }
}
