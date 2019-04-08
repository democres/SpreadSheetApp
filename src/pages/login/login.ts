import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  @ViewChild('username') username: any;
  @ViewChild('password') password: any;

  login(): void {

    if (this.username == "localAdmin" && this.password == "123456"){
        this.navCtrl.push(TabsPage);
    } else {
      alert("Wrong User/Password");
    }

  }

  register(): void {

    // if (this.username == "localAdmin" && this.password == "123456"){
        this.navCtrl.push(TabsPage);
    // } else {
    //   alert("Wrong User/Password");
    // }

  }


}
