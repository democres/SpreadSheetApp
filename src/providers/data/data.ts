  import { Injectable } from '@angular/core';
  import 'rxjs/add/operator/map';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  public paramData: Array<Receipt> = [];
  constructor() {
    console.log('Hello DataProvider Provider');
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