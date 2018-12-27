import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import * as Tesseract from 'tesseract.js'
import { AlertController, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  selectedImage: string;
  imageText: string;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loading: LoadingController) {
  }

  selectSource() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }

  async recognizeImage() {

    const loading = await this.loading.create({
      content: 'Processing Image...',
      spinner: 'crescent', // lines, lines-small, dots, bubbles, circles, crescent
    });
    loading.present();

    Tesseract.recognize(this.selectedImage)
      .progress(message => {
        // if (message.status === 'recognizing text')

      })
      .catch(err => console.error(err))
      .then(result => {
        this.imageText = result.text;
      })
      .finally(resultOrError => {

        loading.dismiss();

        let alert = this.alertCtrl.create({
          title: "Success",
          subTitle: "Image Processed successfully",
          buttons: [{
            text: 'Continue',
            handler: () => {
              this.navCtrl.parent.select(0);
            }
          }]
        });
        alert.present();

      });
  }

}
