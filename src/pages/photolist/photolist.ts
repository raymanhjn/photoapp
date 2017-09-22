import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-photolist',
  templateUrl: 'photolist.html',
})
export class PhotolistPage {
  photos: any;
  public base64Image: string;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private camera: Camera,
    ) {
  }

  ionViewWillEnter() {
    this.photos=[];
  }


  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
     this.base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photos.push(this.base64Image);
     this.photos.reverse();
     console.log(this.photos.length);
    }, (err) => {
     // Handle error
    });
  }

  deletePhoto(index) {
    this.photos.splice(index,1);
    console.log(index);
  }
}
