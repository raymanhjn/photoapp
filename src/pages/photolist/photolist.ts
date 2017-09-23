import { Component ,ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';


@Component({
  selector: 'page-photolist',
  templateUrl: 'photolist.html',
})
export class PhotolistPage {
  @ViewChild('video') videoEle: ElementRef;
  @ViewChild('canvas') canvasEle: ElementRef;

  photo: string;
  public base64Image: string;
  public imageUrl: string;
  photoInfos:any;
  synth:any;
  voices:any;
  text: string;

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

    let video =  this.videoEle.nativeElement;
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
        });
    }
  }

  //for the native device
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photo = this.base64Image;
      this.getData(imageData);
    }, (err) => {
      console.log(err);
    });
  }

  getData(imageData) {
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
              "content":imageData
          }
        }
      ]
    });

    this.http.post(url, request, options)
      .subscribe( data => {
        // console.log(JSON.parse(data['_body']));
        this.photoInfos = JSON.parse(data['_body']).responses[0].labelAnnotations;
        console.log(this.photoInfos);
      }, err => {
        console.log(err);
      });
  }

  speak(content) {
    let speakContent = new SpeechSynthesisUtterance(content);
    this.voices = this.synth.getVoices();
    speakContent.voice = this.voices[0];
    window.speechSynthesis.speak(speakContent);
  }


  //for web
  snapPhoto() {
    //show on canvas dom
    let context = this.canvasEle.nativeElement.getContext('2d');
    let video =  this.videoEle.nativeElement;
    context.drawImage(video, 0,0,640,480);

    //convert to base64 decode
    let dataURL = this.canvasEle.nativeElement.toDataURL("image/png");
    let base64 = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // console.log(base64);

    // set to Google Vision API and get data back
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
              "content":base64
          }
        }
      ]
    });

    this.http.post(url, request, options)
      .subscribe( data => {
        // console.log(JSON.parse(data['_body']));
        //get data back and set to photoInfos then set label buttons
        this.photoInfos = JSON.parse(data['_body']).responses[0].labelAnnotations;
        console.log(this.photoInfos);
      }, err => {
        console.log(err);
      });
  }

}
