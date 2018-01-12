import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, AlertController,App,Nav, Platform,LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ChatuserlistPage } from '../pages/chatuserlist/chatuserlist';
import { ChatroomPage} from '../pages/chatroom/chatroom';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingPage } from '../pages/setting/setting';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
 
}

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
   emailId?:any;
   userEmail?:any;
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  
  loggedInPages: PageInterface[] = [
    { title: 'Home', name: 'DashboardPage', component: DashboardPage, icon: 'home' },
    { title: 'Chat', name: 'ChatuserlistPage', component: ChatuserlistPage, icon: 'chatbubbles' },
    { title: 'Setting', name: 'SettingPage', component: SettingPage, icon: 'settings' },
    { title: 'Logout', name: null, component: null, icon: 'log-out',logsOut: true }
   
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
      { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public  app: App,public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public loadingCtrl: LoadingController
  ) {
   this.registerBackButtonAction();
    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = DashboardPage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.platformReady()
      });

    // load the conference data
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });
    this.enableMenu(true);

    this.listenToLoginEvents();
     events.subscribe('shareObject', (userData) => {       
       localStorage.setItem('userprofileEmailId',JSON.stringify(userData));
       this.userEmail=JSON.parse(localStorage.getItem('userprofileEmailId')); 
       this.emailId=this.userEmail;
  }); 
  }

  registerBackButtonAction(){
    this.platform.registerBackButtonAction(() => { 
                let nav = this.app.getActiveNavs()[0];
                let activeView = nav.getActive();
                if(activeView.name === "GmapPage") { 
                    if (nav.canGoBack()){ //Can we go back?
                        nav.pop();
                    } else {
                        const alert = this.alertCtrl.create({
                            title: 'App termination',
                            message: 'Do you want to close the app?',
                            buttons: [{
                                text: 'Cancel',
                                role: 'cancel',
                                handler: () => {
                                    console.log('Application exit prevented!');
                                }
                            },{
                                text: 'Close App',
                                handler: () => {
                                    this.platform.exitApp(); // Close this application
                                }
                            }]
                        });
                        alert.present();
                    }
                }
            });
}

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      
      this.nav.setRoot(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      let loading = this.loadingCtrl.create({
       content: 'Logout please wait...'
      }); 
    loading.present();
    localStorage.removeItem("logindetail");
    localStorage.removeItem("userprofileEmailId");
    setTimeout(()=>this.welcomeToBack(),
      loading.dismiss()
      ,1000)
      
    }
  }
   welcomeToBack(){    
     this.nav.setRoot(LoginPage);
   }

  // openTutorial() {
  //   this.nav.setRoot(TutorialPage);
  // }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#001f38');
      this.splashScreen.hide();
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
}
