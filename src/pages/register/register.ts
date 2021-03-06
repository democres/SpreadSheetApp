import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';

import { LoadingController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

    
  imageURI:any;
  imageFileName:any;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController,
  private loadingCtrl: LoadingController,
  private toastCtrl: ToastController) {

  }

  @ViewChild('username') username: any;
  @ViewChild('password') password: any;


  login(): void {

    if (this.username == "Test" && this.password == "123456"){
        this.navCtrl.push(TabsPage);
    } else {
      this.showAlert("Wrong User/Password", "Login");
    }

  }

  register(): void {
      this.navCtrl.push(TabsPage);
  }

  showAlert(message, title){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }



}
