import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';


// import { GvisionProvider } from '../../providers/gvision/gvision';



@Component({
  selector: 'page-photolist',
  templateUrl: 'photolist.html',
})
export class PhotolistPage {
  photo: string;
  public base64Image: string;
  public imageUrl: string;
  video:any;
  photoInfos:any;
  synth:any;
  voices:any;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private camera: Camera,
      public http: Http,
    ) {
  }

  ionViewWillEnter() {
    this.photo='';
    this.photoInfos=[];
    this.synth = window.speechSynthesis;
    this.voices=[];
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
      this.imageUrl = imageData;
      this.photo = this.base64Image;
    }, (err) => {
      console.log(err);
    });
  }

  getData() {
    let headers = new Headers({'Content-Type' : 'application/json'});

    let options = new RequestOptions({ headers: headers });
    let API_KEY = "AIzaSyDRgu_6xNGoVzR81dLP2LD2Pl4si3c0MVg";
    let url = 'https://vision.googleapis.com/v1/images:annotate?key='+API_KEY;
    let request = JSON.stringify({
      "requests": [
        {
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ],
          "image": {
              // "content":this.imageUrl
              "source":{
                "imageUri":
                  "gs://photoapp_images/demo-image.jpg"
              }
          }
        }
      ]
    });

    this.http.post(url, request, options)
      .subscribe( data => {
        console.log(JSON.parse(data['_body']));
        this.photoInfos = JSON.parse(data['_body']).responses[0].labelAnnotations;
        console.log(this.photoInfos);
      }, err => {
        console.log(err);
      });
  }


  speak(content) {
    let speakContent = new SpeechSynthesisUtterance(content);
    // this.voices = this.synth.getVoices();
    // speakContent.voice = this.voices[0];
    // window.speechSynthesis.speak(speakContent);
    alert(content);
  }



}
