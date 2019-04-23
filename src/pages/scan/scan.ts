import { Component } from "@angular/core";
import { NavController, ActionSheetController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";

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
    private nativeHttp: HTTP
  ) {}

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
      quality: 100,
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
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();

    let fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "ionicfile",
      fileName: "ionicfile",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        Authorization:
          "basic TGlhbFN5c3RlbXMtRXhwZW5zZS1SZXBvcnQ6ZGU0cnJXR1dXNzE2WE5nV1ByT3dpc2pR"
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
          console.log(data + " Uploaded Successfully");
          loader.dismiss();
          this.presentToast("Image uploaded successfully");
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
          this.getResults(taskId);
           
        },
        err => {
          console.log("FATAL ERROR: " + err);
          loader.dismiss();
          this.showAlert("Error Uploading Image " + JSON.stringify(err), "ANY");
        }
      );
  }


  getResults(taskId) {
 
    let loader = this.loadingCtrl.create({
      content: "Recognizing Image..."
    });
    loader.present();

    this.nativeHttp.get("http://LialSystems-Expense-Report:de4rrWGWW716XNgWPrOwisjQ@cloud-westus.ocrsdk.com/getTaskStatus?taskId=" + taskId,{},{})
    .then(
      data => {
        console.log("**************************************************");
        console.log("**************************************************");
        console.log("THIS IS THE RESULT URL-> " + JSON.stringify(data));

        let parseString = require('xml2js').parseString;
          var taskId = ""
          parseString(data, function (err, result) {
            console.log("THIS IS THE PARSED RESULT URL-> " + JSON.stringify(result));
          });

        console.log("**************************************************");
        console.log("**************************************************");
        loader.dismiss();
      },
      error => {

        console.log("**************************************************");
        console.log("**************************************************");
        console.log("FATAL ERROR --> " + JSON.stringify(error), "FAIL");
        console.log("**************************************************");
        console.log("**************************************************");

        loader.dismiss();
      }
    );

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
