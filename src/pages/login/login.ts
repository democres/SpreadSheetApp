import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
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
      this.navCtrl.push(RegisterPage);
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
