
export interface UserOptions {
  username: string,
  password: string
}
export interface LoginDetail {
  email: string,
  password: string,
  lat?:any,
  long?:any
}

export interface SignUpDetails{

  fullName:string,
	mobileNumber:string,
	email:string,
	password?:string,
	confirmPassword?:string

}
export interface Otpvalue{
      traderMailId: string,
      otp: string
  }

  export interface Markers{

    lat: number;
    lng: number;
    label?: string;
    title: string;
    draggable: boolean;
    icon: string;
}
export interface Trader{
  fullName:string;
  traderId:string;
  buyPrice:number;
  salePrice:number;
  latitude:string;
  longitude:string;
  profileImagePath:string;
  mobileNumber:string;
  address:string;
  volume:number;
  email:string;
  verifyEmail:boolean;
}

export interface SendMessageWithContent {
  sender:string;
  recipient:string;
  content?:string;
  chatId?:string;
}
export interface ChatRequest {
  sender:string;
  recipient:string;
}
export interface UserEmailId{
  email:string;
}

   export interface NewPasswordvalue{
    "userMailId": "",
    "newPassword": "",
    "confirmNewPassword": ""
  }

  
  export interface updateValue{
    "email":string;
    "buyRate": any;
    "sellRate": any;
    "volume":any;
    "currencyType":string;
  }

  

  export interface PasswordValues{
    "userMailId": string;
    "currentPassword": string;
    "newPassword": string;
    "confirmNewPassword": string;
  }
  export interface Location{
   "email":string;
   "lat":any;
   "long":any;
   //"name":any;

  }

