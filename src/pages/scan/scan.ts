import { Component } from "@angular/core";
import { NavController, ActionSheetController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { DataProvider } from "../../providers/data/data";

import {
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";

import {
  Response,
  RequestOptions,
  RequestOptionsArgs
} from "@angular/http";

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HTTP } from '@ionic-native/http';

@Component({
  selector: "page-scan",
  templateUrl: "scan.html"
})
export class ScanPage {
  selectedImage: string;
  imageText: string;
  API_URL = "https://cloud-westus.ocrsdk.com/"

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private nativeHttp: HTTP,
    public sharedData: DataProvider
  ) {}

  loader = this.loadingCtrl.create({
    content: "Uploading..."
  });

  selectSource() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: "Use Library",
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Capture Image",
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }

  getPicture(sourceType) {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.selectedImage = imageData;
      },
      err => {
        console.log(err);
        this.presentToast(err);
      }
    );
  }

 
  uploadImage() {
    
    this.loader.present();

    let fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "ionicfile",
      fileName: "ionicfile",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        Authorization:
          "basic RXhwZW5zZVJlcG9ydERldjpXaE9jOWxVR0Fwb1BQRzUweTIwS2RJMEg="
      }
    };

    fileTransfer
      .upload(
        this.selectedImage,
        this.API_URL + "processReceipt",
        options
      )
      .then(
        data => {
          this.presentToast("Image uploaded successfully");
          this.loader.setContent("Recognizing Image...")
          console.log("--------------------------------------------------");
          console.log("--------------------------------------------------");
          console.log("DATA --> " + JSON.stringify(data), "SUCCESS");
          console.log("--------------------------------------------------");
          console.log("RESPONSE --> " + data.response, "SUCCESS");
          console.log("--------------------------------------------------");
          console.log("--------------------------------------------------");

       
          let parseString = require('xml2js').parseString;
          var taskId = ""
          parseString(data.response, function (err, result) {
            console.log("THIS IS THE RESULT AND ID-> " + JSON.stringify(result.response.task["$"]));
            taskId = result.response.task[0]["$"].id
          });

          console.log("SHOWING taskId ----> " + JSON.stringify(taskId));
          setTimeout(() => {
            this.getResults(taskId);
          }, 22000); 
           
        },
        err => {
          console.log("FATAL ERROR: " + err);
          this.loader.dismiss();
          this.showAlert("Error Uploading Image " + JSON.stringify(err), "ANY");
        }
      );
  }

  getResults(taskId) {

    var headers = new HttpHeaders({'Content-Type': 'text/xml'})
    headers.set('Accept', 'text/xml');
    headers.set('Content-Type', 'text/xml');

    taskId = "97324eb0-0d35-4ffb-9b02-2183d906af9f"
    
    this.http.get("http://ec2-3-16-50-55.us-east-2.compute.amazonaws.com:3333/ocr/"+taskId,{responseType:'text'})
    .subscribe(
      data => {
        console.log("**************************************************");
        console.log("**************************************************");
        console.log("THIS IS THE RESULT URL-> " + data);

        this.processResults(data);

        console.log("**************************************************");
        console.log("**************************************************");
      },
      error => {

        console.log("**************************************************");
        console.log("**************************************************");
        console.log("FATAL ERROR --> " + JSON.stringify(error), "FAIL");
        console.log("**************************************************");
        console.log("**************************************************");

        this.loader.dismiss();
      }
    );

  }


  processResults(ocrResult){

    this.loader.setContent("Processing Image...");
    this.loader.present()
    
    console.log("THIS IS ocrResult -> " + ocrResult);

        let parseString = require('xml2js').parseString;
          var parsedOcr = ""
          parseString(ocrResult, function (err, result) {
            console.log("THIS IS THE PARSED RESULT OCR-> " + JSON.stringify(result));
            parsedOcr = result;
          });

          var receipt = new Receipt("","","","","","");
          receipt.type =  parsedOcr["receipts"].receipt[0].vendor[0].purchaseType[0];
          receipt.vendor = parsedOcr["receipts"].receipt[0].vendor[0].name[0].recognizedValue[0].text[0];
          receipt.state = parsedOcr["receipts"].receipt[0].vendor[0].administrativeRegion[0].normalizedValue[0];
          receipt.total = parsedOcr["receipts"].receipt[0].vendor[0].total[0].normalizedValue[0];
          

          this.sharedData.paramData.push(receipt);
          this.navCtrl.parent.select(0);
          this.loader.dismiss();
  }

  //SHOW MESSAGES TO THE USER

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  showAlert(message, title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
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

