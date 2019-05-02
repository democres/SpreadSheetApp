import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from "../../providers/data/data";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private receipts: Array<Receipt> = [];

  constructor(public navCtrl: NavController, public data: DataProvider) {

    this.receipts = this.data.paramData;
    for (let receipt of this.receipts) { 
      console.log("PRINTING HOME RECEIPTS XXXX> " +receipt);
    }      
  } 

  ionViewWillEnter(){
    console.log("Did data load? : ",this.receipts);
  }

}

export class Receipt {
  constructor(
    public type?: string,
    public state?: string,
    public vendor?: string,
    public city?: string,
    public date?: string,
    public tax?: string,
    public total?: string) { }
}

